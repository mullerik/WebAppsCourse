function fun0() {
    return {
        name: {firstName: "Arie", lastName: "Muller"},
        age: 25,
        gender: "male",
        year: 1991,
        id: 308258243,
        phones: ["054-3191956", "09-8336673"],
        photoURL: "https://41dmav17y2a239wj1k1kd0yt-wpengine.netdna-ssl.com/monitor/wp-content/uploads/sites/3/2016/04/365-Ninja.png",

    }
}
function fun1() {
    return {
        courseName: "Web applications",
        numOfStudents: 30,
        extraInfo: {
            location: "H2",
            startTime: "15:45",
            endTime: "18:15",
            dayOfWeek: 3,
            groupCode: "172313301"
        }
    }
}
function fun2() {
    var course = {};
    course.courseName = "Web applications";
    course.numOfStudents = 30;
    course.extraInfo = {
            location: "H2",
            startTime: "15:45",
            endTime: "18:15",
            dayOfWeek: 3,
            groupCode: "172313301"
    };
    return course;
}


var hoist = 3;
function fun3() {
    // Since hoisting happens, 'hoist' will be undefined
    if (typeof hoist === 'undefined')
        hoist = 10;
    // Without hoisting, 'hoist' will be 3 as declared above
    else
        hoist = 20;
    var hoist;

    return hoist;
}

// Get the i fibonacci number
function fun4(i) {
    var a, b, j, tmp;
    a = 1;
    b = 1;

    if (i < 1 || typeof i !== 'number')
        return null;
    if (i === 1 || i === 2)
        return 1;

    for (j = 2; j < i; j++){
        tmp = b;
        b += a;
        a = tmp;
    }
    return b;
}

// Returns array with numbers 1 to 1000
function fun5() {
    var arr = [];
    for (var i=1; i<=1000; i++)
        arr.push(i);
    arr.problem = "no problem";
    return arr
}



