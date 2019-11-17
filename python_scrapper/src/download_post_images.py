# -*- coding: utf-8 -*-
import calendar
import os
import platform
import sys
import urllib.request
import time

from selenium import webdriver
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from components.login import login

facebook_domain = "https://facebook.com/"

driver = None

def safe_find_element_by_id(driver, elem_id):
    try:
        return driver.find_element_by_id(elem_id)
    except NoSuchElementException:
        return None

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

def create_folder(folder):
    if not os.path.exists(folder):
        os.mkdir(folder)

def start(input_id):
    data_folder = os.path.join(os.getcwd(), "Data")
    os.chdir(data_folder)
    
    profile_folder = os.path.join(os.getcwd(), input_id)
    os.chdir(profile_folder)
    
    posts_lines = open("Posts.txt", newline='\n')
    posts_with_images_file = open("PostsWithImages.txt", 'w', encoding='utf-8', newline='\r\n')
    
    PostPhotosFolder = os.path.join(os.getcwd(), "PostPhotos")
    create_folder(PostPhotosFolder)
    os.chdir(PostPhotosFolder)
    
    PostsWithImagesLines = []
    
    print("Post linkes-----------------")
    for line in posts_lines:
        line = line.rstrip('\r\n')
        elements = line.split("||")
        post_url = elements[-1].strip()
        
        if("http" in post_url):    
            image_preview_opened = False
            print(post_url)
            driver.get(post_url)

            time.sleep(8)
            try:
                element = driver.find_element_by_class_name("spotlight")
                img_url = element.get_attribute('src')
                
                if img_url.find('.gif') == -1:
                    image_preview_opened = True
                
                    img_name = (img_url.split('.jpg')[0]).split('/')[-1] + '.jpg'
                    try:
                        urllib.request.urlretrieve(img_url, img_name)
                        elements.insert(len(elements),img_name)
                        new_file_line = ",".join(elements)
                        PostsWithImagesLines.insert(len(PostsWithImagesLines),new_file_line)
                    except Exception:
                        img_name = "None"
                
            except:
                print("Not found--------------------")
                    
                    
    for line in PostsWithImagesLines:
        posts_with_images_file.writelines(line)
        posts_with_images_file.write('\n')

def download_post_images(facebook_userid, driverInstance):
    global driver
    driver = driverInstance
    with open('credentials.txt') as f:
        email = f.readline().split('"')[1]
        password = f.readline().split('"')[1]

        if not (email and password):
            print(
                "Your email or password is missing. Kindly write them in credentials.txt")
            exit()

    ids = [facebook_domain + facebook_userid]

    if len(ids) > 0:
        print("\nStarting Scraping...")

#        setup_driver()
        
        start(facebook_userid)
    
    else:
        print("Input file is empty.")        
