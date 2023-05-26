function validateUsername() {
    var fullName = document.getElementById("name").value;
    var initialPassword = document.getElementById("Fpass").value;
    var lastPassword = document.getElementById("Lpass").value;
    var firstChar = fullName.charAt(0);
    var ran = /[/*\-+!@#$^&~[\]]/;
  
    if (!/[a-zA-Z]/.test(firstChar)) {
      alert("Name must start with a letter!");
    } 
    if (fullName.length <= 2) {
      alert("Name must be longer than 3 letters!");
    }
    if (initialPassword.length <= 7) {
      alert("Password must be longer than 8 characters!");
    }
    if (!/[a-z]/.test(initialPassword) || !/[A-Z]/.test(initialPassword)) {
      alert("Password must contain at least one uppercase and one lowercase letter!");
    }
    if (!ran.test(initialPassword)) {
      alert("Password must contain at least one of the following: / * - + ! @ # $ ^ & ~ [ ]");
    }
    if(lastPassword != initialPassword){
      alert("Passwords do NOT matchup. Please input again!");
    }
  }
  