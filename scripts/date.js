var date = function(){
    var day = new Date();
    var dayFormat = "";

    dayFormat += (day.getMonth() + 1) + "_";
    dayFormat += (day.getDate) + "_";
    dayFormat += (day.getFullYear) + "_";

    return dayFormat;
};

module.exports = setDate;

