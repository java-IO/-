$(function () {
    //给注册表单注册submit事件
    $("form").submit(function () {
        return register();
    });
    $("#verify_code").click(function () {
        var time = 60;
        var flag = true;
        var status = 200;
        var userPahone = $("form input[name=phone]").val();
        if (userPahone == "") {
            return
        }
        $("#code").show();//显示验证码输入框
        if (flag) {
            var timer = setInterval(function () {
                if (time == 60 && flag) {
                    flag = false;

                    $.ajax({
                        type: 'get',
                        async: false,
                        url: 'http://192.168.1.4:8080/user/phone',
                        data: {
                            "phone": userPahone
                        },
                        dataType: "json",
                        success: function (data) {
                            console.log(data);
                            if (data.status != 202) {
                                if (data.status == 200) {
                                    $("#code span").html("已发送");
                                } else {
                                    flag = true;
                                    time = 60;
                                    clearInterval(timer);
                                }
                            } else {
                                alert(data.msg)
                            }

                        }
                    });

                } else if (time == 0) {
                    clearInterval(timer);
                    time = 60;
                    flag = true;
                    $("#verify_code").show();
                    $("#auth_msg").hide();
                } else {
                    $("#code span").html(time + " s 重新发送");
                    time--;
                    $("#verify_code").hide();
                }
            }, 1000)
        }
    });
});

function register() {
    var userName = $("form input[name=name]").val();
    var userPassword = $("form input[name=password]").val();
    var userPassword2 = $("form input[name=password2]").val();
    var userPahone = $("form input[name=phone]").val();
    var userAuth = $("form input[name=auth]").val();
    var flag = formObj.checkForm();

    if (flag) {
        $.ajax({
            url: "http://192.168.1.4:8080/user/regist",
            type: "post",
            data: {
                "password": userPassword,
                "phone": userPahone,
                "auth": userAuth,
            },
            dataType: "json",
            success: function (result) {
                if (result.status == 200) {
                    alert("注册成功!")
                    return;
                } else if (result.status == 202) {
                    alert("验证码错误,请重新输入");
                    return;
                } else {
                    alert(result.message);
                }
            },
            error: function () {
                alert("请求失败");
            }
        });
    }

    return false;
}

var formObj = {
    checkForm: function () {
        var flag = true;
        // 非空验证
        flag = this.checkMsg("password", "请输入8-18位的字母和数字的结合") && flag;
        flag = this.checkNull("password", "密码不能为空") && flag;
        flag = this.checkNull("password2", "确认密码不能为空") && flag;
        flag = this.checkNull("phone", "电话不能为空") && flag;
        flag = this.checkNull("auth", "验证码不能为空") && flag;
        //flag = this.checkNull("valistr", "验证码不能为空") && flag;
        // 两次输入的密码是否相同
        flag = this.checkPassword("password", "两次密码不相同") && flag;
        // 邮箱格式
        flag = this.checkPhone("phone", "请填写正确的电话号码") && flag;
        // 返回flag
        return flag;
    },
    checkNull: function (name, msg) {
        var value = $("input[name=" + name + "]").val();
        if ($.trim(value) == "") {
            this.setMsg(name, msg);
            return false;
        }else{
        	this.setMsg(name, "");
        }
        return true;
    },
    checkMsg: function (name, msg) {//验证密码格式
        var value = $("input[name=" + name + "]").val();
        var reg =/^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]{8,18}$/;
        if (!reg.test(value)) {
            this.setMsg(name, msg);
            return false;
        }else{
        	this.setMsg(name, "");
        }
        return true
    },
    checkPassword: function (name, msg) {
        var pwd = $("input[name=" + name + "]").val();
        var pwd2 = $("input[name=" + name + "2]").val();
        if ($.trim(pwd) != "" && $.trim(pwd2) != "") {
            if (pwd != pwd2) {
                this.setMsg(name, msg);
                return false;
            }else{
        	this.setMsg(name, "");
        }
        }
        return true;
    },
    checkPhone: function (name, msg) {
        var value = $("input[name=" + name + "]").val();
        var reg = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;
        if (!reg.test(value)) {
            this.setMsg(name, msg);
            return false;
        }else{
        	this.setMsg(name, "");
        }
        return true;
    },
    setMsg: function (name, msg) {
        $("#" + name + "_msg").text(msg);
    }
};