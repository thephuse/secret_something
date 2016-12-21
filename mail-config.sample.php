<?php 
  $mail_config_isSMTP = true;                     // Set mailer to use SMTP
  $mail_config_Host = 'smtp1.example.com';        // Specify main and backup SMTP servers. For Mailgun use smtp.mailgun.org
  $mail_config_SMTPAuth = true;                   // Enable SMTP authentication
  $mail_config_Username = 'user@example.com';     // SMTP username
  $mail_config_Password = 'secret';               // SMTP password, for Mandrill use your API key
  $mail_config_SMTPSecure = 'tls';                // Enable TLS encryption, `ssl` also accepted
  $mail_config_Port = 587;                        // TCP port to connect to
?>