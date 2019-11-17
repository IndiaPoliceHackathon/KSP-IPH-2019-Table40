import calendar
import os
import platform
import sys
import urllib.request
import time
import boto3

from selenium import webdriver
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

facebook_domain = "https://facebook.com/"

# Setting up Selenium and logging in
def safe_find_element_by_id(driver, elem_id):
    try:
        return driver.find_element_by_id(elem_id)
    except NoSuchElementException:
        return None

def login(email, password, driver):
    """ Logging into our own profile """
    try:
        driver.get(facebook_domain)

        # filling the form
        driver.find_element_by_name('email').send_keys(email)
        driver.find_element_by_name('pass').send_keys(password)

        # clicking on login button
        driver.find_element_by_id('loginbutton').click()

        # if your account uses multi factor authentication
        mfa_code_input = safe_find_element_by_id(driver, 'approvals_code')

        if mfa_code_input is None:
            return

        mfa_code_input.send_keys(input("Enter MFA code: "))
        driver.find_element_by_id('checkpointSubmitButton').click()

        # there are so many screens asking you to verify things. Just skip them all
        while safe_find_element_by_id(driver, 'checkpointSubmitButton') is not None:
            dont_save_browser_radio = safe_find_element_by_id(driver, 'u_0_3')
            if dont_save_browser_radio is not None:
                dont_save_browser_radio.click()

            driver.find_element_by_id('checkpointSubmitButton').click()

    except Exception:
        print("There's some error in log in.")
        print(sys.exc_info()[0])
        
def setup_driver():
    global driver

    options = Options()
    options.add_argument("--disable-notifications")
    options.add_argument("--disable-infobars")
    options.add_argument("--mute-audio")

    try:
        platform_ = platform.system().lower()
        if platform_ in ['linux', 'darwin']:
            driver = webdriver.Chrome(
                executable_path="./chromedriver", options=options)
        else:
            driver = webdriver.Chrome(
                executable_path="./chromedriver.exe", options=options)
    except Exception:
        print("Kindly replace the Chrome Web Driver with the latest one from "
                "http://chromedriver.chromium.org/downloads "
                "and also make sure you have the latest Chrome Browser version."
                "\nYour OS: {}".format(platform_)
                )
        exit()
    
    driver.maximize_window()
    

setup_driver()
login("email", "Password", driver)

# Processing the search engine query
try: 
    from googlesearch import search 
except ImportError:  
    print("No module named 'google' found") 

query = "Enter your query"
googled_urls = []
for j in search(query, num=10, stop=30, pause=2): 
    googled_urls.append(j)

# Scraping the Profile for images
import time
import urllib.request
count = 0
required_urls = []
for i in googled_urls:
    if(((i.count('/') <= 3) and (i.count('facebook.com') == 1) and (i.count('?') < 1)) or ((i.count('/') ==4) and (i.count('facebook.com') == 1) and (i[-1]=='/'))):
        facebook_username = i.split("/")[-1]
        driver.get("https://facebook.com/"+facebook_username)
        
        fileName = str(facebook_username) + ".jpeg"
        driver.find_element_by_id('u_0_v').click()
        time.sleep(4)
        
        try:
            element = driver.find_element_by_class_name("spotlight")
            img_url = element.get_attribute('src')
            print(img_url)
        
            if img_url.find('.gif') == -1:
                try:
                    print('***********')
                    required_urls.append(i)
                    urllib.request.urlretrieve(img_url, fileName)
                except Exception as e:
                    print(str(e))
        
        except:
            print("-Not found-")

# Upload target images to s3 for aws rekognition

ACCESS_KEY = 'Enter access key'
SECRET_KEY = 'Enter secret key'

s3 = boto3.client('s3',
                    region_name="Enter region Name",
                    aws_access_key_id=ACCESS_KEY,
                    aws_secret_access_key=SECRET_KEY)

for i in required_urls:
    if(i.split("/")[-1] == ''):
        file_name = i.split("/")[-2]+'.jpeg'
    else:
        file_name = i.split("/")[-1]+'.jpeg'
        
    bucket = 'Enter target bucket name'
    # file_name = 'location-of-your-file'
    key_name = file_name
    s3.upload_file(file_name, bucket, key_name)


# Run the aws Rekognition API 
for i in required_urls:
    if(i.split("/")[-1] == ''):
        file_name = i.split("/")[-2]+'.jpeg'
    else:
        file_name = i.split("/")[-1]+'.jpeg'
    client = boto3.client(
        'rekognition'
    )
    print(file_name)
    response = client.compare_faces(
        SimilarityThreshold=50,
        SourceImage={
            'S3Object': {
                'Bucket': 'Enter bucket name',
                'Name': 'Image name'
            }
        },
        TargetImage={
            'S3Object': {
                'Bucket': 'Enter bucket name',
                'Name': file_name
            }
        }
    )
    if(len(response['FaceMatches'])>0):
        if((response['FaceMatches'][0]['Similarity'])>90):
            print(response['FaceMatches'][0]['Similarity'])
            required_username = file_name[:-5]
print('Required username',required_username)
