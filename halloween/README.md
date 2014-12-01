Secret Something
======

Secret Something Project

Overview
-------------

Static HTML/CSS/JS site intended for use with a secret gift exchange. Currently themed for Christmas, but can be re-themed for use with any holiday.

This project sends participant notification emails via [Mandrill](http://mandrillapp.com)'s SMTP configuration.

A working sample can be found at [secretsanta.phuse.ca](http://secretsanta.phuse.ca/).

Development
-------------

###Requirements

* Knowledge of [knockout.js](http://knockoutjs.com/)
* Sass CLI or a GUI for compiling .scss to sass

```bash
git clone git@github.com:thephuse/secret_something.git
cd secret_something/styles
sass --watch style.scss:style.css # alternatively compile sass using a GUI
```

Deployment
-------------
This site can easily be hosted on your own servers. In addition to creating a [Mandrill](http://mandrillapp.com) account and filling in the custom information in mail-config.sample.php (resave the file as mail-config.php), simply update any other files needed to suit your needs and upload all site files to your server via FTP.
