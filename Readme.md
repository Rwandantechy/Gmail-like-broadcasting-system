# Mass Mailing using Nodemailer

Welcome to the Broadcasting Emails repository! This Nishkaam emailing system is designed for product promotion, specifically tailored for broadcasting product-related messages to a wide audience. The system facilitates effective email marketing campaigns, allowing seamless communication with a targeted customer base.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
   - [Installation](#installation)
   - [Usage](#usage)
- [License](#license)

## Introduction

The Broadcasting Emails system is a versatile tool for promoting products through email marketing. It provides a straightforward solution for sending mass emails to a large audience, helping businesses and individuals reach their target market efficiently.

## Features

- **Broadcasting:** Send mass emails to a broad audience.
- **Customization:** Easily customize email content and templates.
- **Integration:** Seamlessly integrate with your existing systems.
- **Analytics:** Track the performance of your email campaigns.
- **Easy Setup:** Quick and straightforward setup process.

## Getting Started

To get started with Broadcasting Emails, follow these steps:

### Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/Rwandantechy/broadcasting-emails.git

   ```


### Usage

1. Configure environment variables:
   Create a `.env` file in the root directory with the following variables:
   I have used ``MySql DBMS`` but feel to adjust to your  databse of choice.
   
   1. ``PORT=4000`` 
   2. ``MYSQL_HOST=your_mongodb_uri`` 
   3. ``JWT_EXPIRES_IN= anytime accordingly, eg: 1d``
   4. ``SENDING_MAIL=your_email_address``
   5. ``SENDING_MAIL_PASSWORD=your_password``
   6. ``JWT_SECRET= put your secret here``
   6. ``MYSQL_HOST=localhost``
   7. ``MYSQL_PORT=3306``
   8. ``MYSQL_USER=root``
   9. ``MYSQL_PASSWORD=""``
   10. ``MYSQL_DATABASE=`db-name``
   

2. 
    ``` 
    cd broadcasting-emails

    ```
  
3.  Install the dependencies:

    ``` 
     npm install

    ```
4. Start the server:

   ```  
    npm start or node server.js

   ```

5. Access the homepage at `http://localhost:4000`.

6.  you can access other endpoints: ```http://localhost:4000/{endpoint}```

## License

[MIT License](LICENSE).
Feel free to adjust the content further based on your specific project details.
This version is free to be used but remember to give credits to us.
