<?php 

  // get request variables that are sent from AJAX
  $data = $_REQUEST['data'];

  // if $data isn't set, stop the presses
  if(empty($data)){
    die();
  }
 
  // $data should now contain a string of "stringified" JSON, so let's decode it for PHP
  $data = json_decode($data);
  // $data should now be a full PHP variable containing our structure data from our JS. If it's null or we don't have members, stop everything!
  if($data === NULL && !empty($data->members) ){
    die();
  }

  //create members array the way Secret Santa Script needs it
  $members = array();
  foreach($data->members as $member){
    array_push($members, array(
      'name' => $member->name,
      'email' => $member->email
    ));
  }
  // now $members is set up the way we want, let's run it through the Secret Santa script
  $santa = new SecretSanta();
  $santa->run($members);

/*
 * PHP Secret Santa
 * A very simple PHP based Secret Santa Script.
 *
 * @Author Carl Saggs (2011)
 * @license MIT License
 *
 * Basic Usage:
 *  $santa = new SecretSanta();
 *  $santa->run(
 *      array(
 *          array('name'=>'Bob','email'=>'bob@bobnet.com'),
 *          array('name'=>'Dave','email'=>'dave@davenet.com')
 *        )
 *      );
 */
Class SecretSanta {
  //Vars
  private $item_value = 5;
  private $mail_from = 'Santa < santa@yourdomain.com >';
  private $mail_title = 'Secret Santa';
  //Logging
  private $sent_emails = array();
  
  /**
   * Run
   * runs the secret santa script on an array of users. 
   * Everyone is assigned their secret santa and emailed with who they need to buy for.
   * @param $users Array
   * @return success
   */
  public function run($users_array){
    //Check array is safe to use
    $ok = $this->validateArray($users_array);
    if(!$ok) return false;
    //If no issues, run!
    $matched = $this->assign_users($users_array);
    $this->sendEmails($matched);
    return true;
  }
  
  /**
   * Validate Array
   * Ensure array is safe to use in Secret Santa Script
   * @param Users Array
   * @return true if safe.
   */
  private function validateArray($users_array){
    //Ensure that more than 2 users have been provided
    if(sizeof($users_array)<2){
      echo '[Error] A minimum of 2 secret santa participants is required in order to use this system.';
      return false;
    }
    //Check there are no duplicate emails
    $tmp_emails = array();
    foreach($users_array as $u){
      if(in_array($u['email'],$tmp_emails)){
        echo "[Error] Users cannot share an email or be in the secret santa more than once.";
        return false;
      }
      $tmp_emails[] = $u['email'];
    }
    return true;
  }
  /**
   * Set the title of secret santa emails sent.
   * @param $title
   */
  public function setTitle($title){
    $this->mail_title = $title;
  }
  
  /**
   * Set the price secret santa items should be around
   * @param $price (in £'s)
   */
  public function setAmount($price){
    $this->item_value = $price;
  }
  
  /**
   * Set who your want the email to be sent from
   * @param $name Name of Sender (e.g. Santa)
   * @param $email Email of Sender (e.g. Santa@somedomain.com)
   */
  public function setFrom($name,$email){
    $this->mail_from = "{$name} < {$email} >";
  }
  
  /**
   * Assign every user in the array their secret santa
   * Ensuring that everyone is assigned randomly and doesn't get themselves
   *
   * @param array of users
   * @return array of assigned users
   */
  private function assign_users($users_array){
    //$users = array(array())
    $givers     = $users_array;
    $receavers  = $users_array;
    //Foreach giver
    foreach($givers as $uid => $user){
      $not_assigned = true;
      //While a user hasn't been assigned their secret santa
      while($not_assigned){
        //Randomly pick a person for the user to buy for
        $choice = rand(0, sizeof($receavers)-1);
        //If randomly picked user is NOT themselves
        if($user['email'] !== $receavers[$choice]['email']){
          //Assign the user the randomly picked user
          $givers[$uid]['giving_to'] = $receavers[$choice];
          //And remove them from the list
          unset($receavers[$choice]);
          //Correct array
          $receavers = array_values($receavers);
          //exit loop
          $not_assigned = false;
        }else{
          //If we are the laster user left and have been given ourselfs
          if(sizeof($receavers) == 1){
            //Swap with someone else (in this case the first guy who got assigned.
            //Steal first persons, person and give self to them.
            $givers[$uid]['giving_to'] = $givers[0]['giving_to'];
            $givers[0]['giving_to'] = $givers[$uid];
            $not_assigned = false;
          } 
        }
      }
    }
    //Return array of matched users
    return $givers;
  }
  
  /**
   * Send Emails
   * Emails all matched users with details of who they should be buying for.
   * @param $matched users
   */
  private function sendEmails($assigned_users){
    global $data;
    //For each user
    foreach($assigned_users as $giver){
      //Compose the email
      $email_subject = $data->hostName . " has invited you to participate in " . $data->eventTitle ."!";
      $email_body = strip_tags("Hello, {$giver['name']}! 
        " . $data->hostName . " has invited you to participate in " . $data->eventTitle ."! You will be purchasing a gift for {$giver['giving_to']['name']} ({$giver['giving_to']['email']}), and your gift exchange is scheduled for " . $data->eventDate . ".

        About This Event:
        " . $data->desc ."

        Any additional questions can be directed to " . $data->hostName . " (" . $data->hostEmail . ").

        This is a system generated email. Please do not reply to this email. Questions or comments should be directed to the email noted above.

        ");

  var_dump($email_body);
    } 
  }
}

?>