import calendar
import os
import platform
import sys
import urllib.request

from selenium import webdriver
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from components.login import login

from scraper import scrap_facebook_account

levels = 3
list_of_profiles = []

second_iteration_profiles = []
driver = None

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

    with open('credentials.txt') as f:
        email = f.readline().split('"')[1]
        password = f.readline().split('"')[1]

        if not (email and password):
            print(
                "Your email or password is missing. Kindly write them in credentials.txt")
            exit()
    
    login(email, password, driver)


def get_user_friends_ids(user_id):
    lines = open("Data/"+str(user_id)+"/All Friends.txt", newline='\n')
    
    return [line.split(',')[0].split('/')[-1] for line in lines]


setup_driver()
for i  in range(0,levels):
    list_of_profiles = [name for name in os.listdir("./Data")]
    print(list_of_profiles)

    if(len(list_of_profiles) == 0):
        ids = [line.split("/")[-1] for line in open("input.txt", newline='\n')]
        scrap_facebook_account(ids[0], driver)
        
    elif(len(list_of_profiles) == 1):
        second_iteration_profiles = list_of_profiles
        friends_ids = get_user_friends_ids(second_iteration_profiles[0])
        for friend_id in friends_ids:
            scrap_facebook_account(friend_id, driver)    

    elif(i > 1):
        print("Second iteration files: ")
        print(second_iteration_profiles)
        for user_id in list_of_profiles:
            if(user_id not in second_iteration_profiles):
                friends_ids = get_user_friends_ids(user_id)
                print(friends_ids)
                for friend_id in friends_ids:
                    scrapped_accounts = [name for name in os.listdir("./Data")]
                    if(friend_id not in scrapped_accounts):
                        scrap_facebook_account(friend_id, driver)    
        
        

