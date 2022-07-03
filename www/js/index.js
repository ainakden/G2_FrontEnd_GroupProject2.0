var db;
document.addEventListener('deviceready', onDeviceReady, true);

function onDeviceReady() {
    //open the database
    db = window.sqlitePlugin.openDatabase({
        name: 'users.db',
        location: 'default'
    },
        function () {
            alert("DB Opened Successfully!");
        },
        function () {

            alert("DB Failed to open!");

        }

    );
    //create a table
    db.transaction(
        function (tx) {
            var query = "CREATE TABLE IF NOT EXISTS users (nickname TEXT PRIMARY KEY, username TEXT NOT NULL,password TEXT NOT NULL)";

            tx.executeSql(query, [],
                function (tx, result) {
                    alert("Table created Successfully!");
                },
                function (err) {
                    alert("error occured:" + err.code);
                }
            );
        }
    );

    db.transaction(function (tx) {
        tx.executeSql('SELECT *FROM users', [],
            function (tx, results) {
                var len = results.rows.length;

                if (len > 0) {
                    htmlText = ""; // global variable
                    for (i = 0; i < len; i++) {
                        //local variable
                        htmlText = htmlText + "<tr><td>" + results.rows.item(i).nickname +
                            "</td><td>" + "<a href='#viewuser/" + results.rows.item(i).nickname +
                            "'>" + "<span class='glyphicon glyphicon-chevron-right' style='float:right;'></span></a>" + "</td></tr>";
                    }
                    $('#tabledata tbody').html(htmlText);
                } else {
                    htmlText = "<tr><td>No data found!</td></tr>"
                    $('#tabledata tbody').html(htmlText);
                }
            });
    });
    $("#showdata").show();
    $("#divshowlist").hide();
    $("#diveditform").hide();
    $("#divnewform").hide();

}

$(document).ready(function () {
    $("#divbtn").show();
    function parseHash(newHash, oldHash) {
        crossroads.parse(newHash);
    }
    hasher.initialized.add(parseHash); //parse initial hash
    hasher.changed.add(parseHash); //parse hash changes
    hasher.init(); //start listening for history change
    hasher.setHash(link2);
    hasher.setHash(link3);
    hasher.setHash(link4);
    hasher.setHash(linkBackupServer);
    hasher.setHash(linkRestore);

    var link2 = crossroads.addRoute('viewuser/{nickname}', function (nickname) {
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM users where nickname = ?', [nickname],
                function (tx, results) {

                    var nickname = String(results.rows.item(0).nickname);
                    var username = String(results.rows.item(0).username);
                    var password = String(results.rows.item(0).password);

                    $("#showusername").val(username);
                    $("#showpassword").val(password);
                    var editId = String("#btnEdit/" + nickname)
                    $("#btnpencil").attr("href", editId)
                    var DeleteId = String("#btnDelete/" + nickname)
                    $("#btntrash").attr("href", DeleteId)
                });
        });

        $("#showdata").hide();
        $("#divshowlist").show();
        $("#diveditform").hide();
        $("#divnewform").hide();

    });

    var link3 = crossroads.addRoute('myBtn1', function () {
        //code here
        $("#nickname").val("");
        $("#username").val("");
        $("#password").val("");
        $("#showdata").hide();
        $("#divshowlist").hide();
        $("#diveditform").hide();
        $("#divnewform").show();
    });

    var link4 = crossroads.addRoute('btnEdit/{nickname}', function (nickname) {
        var nn = String(nickname);

        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM users where nickname = ?', [nn],
                function (tx, results) {
                    var username = String(results.rows.item(0).username);
                    var password = String(results.rows.item(0).password);

                    $("#editusername").val(username);
                    $("#editpassword").val(password);
                });
        });
        $("#divnewform").hide();
        $("#divshowlist").hide();
        $("#diveditform").show();

    });

    var link5 = crossroads.addRoute('btnDelete/{nickname}', function (nickname) {
        var nn = String(nickname);

        db.transaction(function (tx) {
            var result = confirm("Want to delete?");
            if (result) {
                tx.executeSql('DELETE FROM users where nickname = ?', [nn],
                    function (tx, results) {
                        alert("User is deleted");
                    });
            } else {
                alert("account not deleted")
            }

        });

        db.transaction(function (tx) {
            tx.executeSql('SELECT *FROM users', [],
                function (tx, results) {
                    var len = results.rows.length;

                    if (len > 0) {
                        htmlText = "";
                        for (i = 0; i < len; i++) {
                            htmlText = htmlText + "<tr><td>" + results.rows.item(i).nickname +
                                "</td><td>" + "<a href='#viewuser/" + results.rows.item(i).nickname +
                                "'>" + "<span class='glyphicon glyphicon-chevron-right' style='float:right;'></span></a>" + "</td></tr>";
                        }
                        $('#tabledata tbody').html(htmlText);
                    } else {
                        htmlText = "<tr><td>No data found!</td></tr>"
                        $('#tabledata tbody').html(htmlText);
                    }
                });
        });
        $("#showdata").show();
        $("#divnewform").hide();
        $("#divshowlist").hide();
        $("#diveditform").hide();
    });


    $("#divnewform").submit(function (e) {
        e.preventDefault();
        e.stopPropagation();

        //get the value from form
        var nickname = $("#nickname").val();
        var username = $("#username").val();
        var password = $("#password").val();

        //db transaction
        db.transaction(function (tx) {
            var query = "INSERT INTO users (nickname, username, password) values(?, ?, ?)";
            tx.executeSql(query, [nickname, username, password],

                function (tx, results) {
                    alert("Data Inserted!");
                    $("#showdata").show();
                    $("#divnewform").hide();
                    $("#divshowlist").hide();
                    $("#diveditform").hide();
                },
                function (error) {
                    alert("Error, try again!");
                }
            );
        });

        db.transaction(function (tx) {
            tx.executeSql('SELECT *FROM users', [],
                function (tx, results) {
                    var len = results.rows.length;

                    if (len > 0) {
                        htmlText = "";
                        for (i = 0; i < len; i++) {
                            htmlText = htmlText + "<tr><td>" + results.rows.item(i).nickname +
                                "</td><td>" + "<a href='#viewuser/" + results.rows.item(i).nickname +
                                "'>" + "<span class='glyphicon glyphicon-chevron-right' style='float:right;'></span></a>" + "</td></tr>";
                        }
                        $('#tabledata tbody').html(htmlText);
                    } else {
                        htmlText = "<tr><td>No data found!</td></tr>"
                        $('#tabledata tbody').html(htmlText);
                    }
                });
        });
        $("#showdata").show();
        $("#divshowlist").hide();
        $("#diveditform").hide();
        $("#divnewform").hide();
    });

    $("#diveditform").submit(function (e) {
        e.preventDefault();
        e.stopPropagation();

        //get the value from form
        var user = $("#editusername").val();
        var password = $("#editpassword").val();


        //db transaction
        db.transaction(function (tx) {
            var query = "UPDATE users set username=?,password=? where nickname=?";
            tx.executeSql(query, [user, password, nickname],

                function (tx, results) {
                    alert("Data Updated!");
                    $("#showdata").show();
                    $("#divshowlist").hide();
                    $("#diceditform").hide();
                    $("#divnewform").hide();
                },
                function (error) {
                    alert("Error, try again!");
                }
            );
        });

        db.transaction(function (tx) {
            tx.executeSql('SELECT *FROM users', [],
                function (tx, results) {
                    var len = results.rows.length;

                    if (len > 0) {
                        htmlText = "";
                        for (i = 0; i < len; i++) {
                            htmlText = htmlText + "<tr><td>" + results.rows.item(i).nickname +
                                "</td><td>" + "<a href='#viewuser/" + results.rows.item(i).nickname +
                                "'>" + "<span class='glyphicon glyphicon-chevron-right' style='float:right;'></span></a>" + "</td></tr>";
                        }
                        $('#tabledata tbody').html(htmlText);
                    } else {
                        htmlText = "<tr><td>No data found!</td></tr>"
                        $('#tabledata tbody').html(htmlText);
                    }
                });
        });
        $("#showdata").show();
        $("#divshowlist").hide();
        $("#diveditform").hide();
        $("#divnewform").hide();
    });

    // function to backup local storage to cloud database
    var linkBackupServer = crossroads.addRoute('/backup', function () {
        db.transaction(function (tx) {
            tx.executeSql('SELECT *FROM users', [],
                function (tx, results) {
                    var len = results.rows.length;
                    //Example : [{"nickname":"Maybank","usename":"ahmad","password": "1234" },{nickname":"Water","usename":"Faisal","password": "1234"}]
                    if (len > 0) {
                        alert("Click on Backup!")
                        //alert("length :" + len);
                        var firstnickName = results.rows.item(0).nickname;
                        var firstusername = results.rows.item(0).username;
                        var firstusernamepassword = results.rows.item(0).password;

                        var alldata = [{ "nickname": firstnickName, "username": firstusername, "password": firstusernamepassword, }];

                        for (i = 1; i < len; i++) {
                            var nickName = results.rows.item(i).nickname;
                            var username = results.rows.item(i).username;
                            var usernamepassword = results.rows.item(i).password;

                            const data = [{ "nickname": nickName, "username": username, "password": usernamepassword, }];

                            alldata = alldata.concat(data);
                        }
                        var printJson = JSON.stringify(alldata)
                        var userEmail = prompt("Please enter the email that you use to login for the server", "default@gmail.com");

                        if (userEmail == null || userEmail == "") {
                            alert("You've cancelled the backup process.");
                        } else {
                            alert("Thank you for your email. We'll process your backup now!");

                            var alldataJsonString = JSON.stringify(alldata);
                            var datalist = "userEmail=" + userEmail + "&data=" + JSON.stringify(alldataJsonString)
                            $.ajax({

                                type: "post",
                                url: "https://kerbau.odaje.biz/mokdebackup.php",
                                data: datalist,
                                cache: false,
                                success: function (returneddata) {
                                    alert("link to cloud db successfully!")
                                    var data = JSON.parse(returneddata);
                                    if (data.status === 1) {
                                        alert("We got your back! Your data has been backed up!");
                                    } else if (data.status === 0) {
                                        alert("Failed to store data to cloud, Please contact server admin!");
                                    } else
                                        alert("Unknown error,Please contact admin!")

                                },
                                error: function () {
                                    alert("Please contact admin");

                                }
                            });
                        }
                    } else {
                        alert("Failed to backup!");
                    }

                });
        });
    });

    var linkRestore = crossroads.addRoute('/restore', function () {
        var emailtosearch = prompt("Email used to backup your database ?", "default@gmail.com");
        var datalist = "q=" + emailtosearch;
        //alert(datalist)
        $.ajax({

            type: "post",
            url: "https://kerbau.odaje.biz/mokderestore.php",
            data: datalist,
            cache: false,
            success: function (returneddata) {
                alert("Connected to database!")
                var data = JSON.parse(returneddata);
                var arraydatainJsonString = JSON.parse(data.data);
                var arraydata = JSON.parse(arraydatainJsonString)
                var datalength = arraydata.length;

                var valueText = "";
                valueText = "('" + arraydata[0].nickname + "','" + arraydata[0].username + "','" + arraydata[0].password + "');";
                for (i = 1; i < datalength; i++) {
                    var nicknameinJsonArray = arraydata[i].nickname;
                    var usernameinJsonArray = arraydata[i].username;
                    var passwordinJsonArray = arraydata[i].password;


                    valueText = "('" + arraydata[i].nickname + "','" + arraydata[i].username + "','" + arraydata[i].password + "')," + valueText;

                }
                db.transaction(function (tx) {
                    var result = confirm("Delete all local storage for restoration purpose?");
                    if (result) {
                        tx.executeSql('DELETE FROM users', [],
                            function (tx, results) {
                                alert("Data in local storage is deleted");
                            });
                    } else {
                        alert(" You just cancel the restore process.")
                    }
                })

                db.transaction(function (tx) {
                    var query = "INSERT INTO users (nickname, username, password) values " + valueText;
                    //alert("query:" + query)
                    tx.executeSql(query, [],

                        function (tx, results) {
                            alert("Data Inserted For Restore!");

                        },
                        function (error) {
                            alert("Failed to insert data from local storage during restoring process, try again!");
                        }
                    );
                });

                db.transaction(function (tx) {
                    tx.executeSql('SELECT *FROM users', [],
                        function (tx, results) {
                            var len = results.rows.length;

                            if (len > 0) {
                                htmlText = "";
                                for (i = 0; i < len; i++) {
                                    htmlText = htmlText + "<tr><td>" + results.rows.item(i).nickname +
                                        "</td><td>" + "<a href='#viewuser/" + results.rows.item(i).nickname +
                                        "'>" + "<span class='glyphicon glyphicon-chevron-right' style='float:right;'></span></a>" + "</td></tr>";

                                }

                                $('#tabledata tbody').html(htmlText);

                            } else {
                                htmlText = "<tr><td>No data found!</td></tr>"
                                $('#tabledata tbody').html(htmlText);
                            }
                        });
                });
                $("#showdata").show();
                $("#divshowlist").hide();
                $("#diveditform").hide();
                $("#divnewform").hide();

            },
            error: function () {
                alert("Please contact admin!")
            }
        });
    });

});
