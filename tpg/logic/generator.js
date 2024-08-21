const planner = require('./planner');
const logger = require('./logger');

// generate a training plan based on user input
function generateTrainingPlan(userInput) {
    console.log(userInput);

    const weeks = userInput.weeks;
    const frequency = userInput.frequency;
    const targetTime = userInput.targetTime;
    const firstLongRun = userInput.firstLongRun;
    const longRunDay = userInput.longRunDay;

    const workoutDays = planner.getWorkoutDays(frequency, longRunDay);
    const workoutTypes = planner.getWorkoutTypes(frequency);
    const peakLongRun = planner.getPeakLongRun(targetTime);

    const interval = Math.round((peakLongRun - firstLongRun) / (weeks - 4) * 100) / 100;
    console.log(interval);

    var trainingPlan = new Array();
    for (let i = 1; i <= weeks; i++) {
        
        var longRunDistance = (i <= weeks - 3) ? 
            Math.round(firstLongRun + (interval * (i - 1))) : 
            Math.round((peakLongRun / 6) + (peakLongRun / 6) * (weeks - i));

        var easyRunCount = 0;
        var workouts = new Array();
        for (let j = 0; j < frequency; j++) {
            var workoutDistance;
            if (workoutTypes[j] == 'long') {
                workoutDistance = longRunDistance;
                if (i == weeks) {
                    workoutTypes[j] = 'race day';
                    workoutDistance = 42.2;
                }
            }
            else if (workoutTypes[j] == 'easy') {
                var rawEasyDistance = Math.floor(longRunDistance * 0.5);
                var minEasyDistance = Math.floor(firstLongRun * 0.6);
                workoutDistance = Math.min(12, Math.max(rawEasyDistance, minEasyDistance));
                if (easyRunCount % 2 == 1 && i <= weeks - 3)
                    workoutDistance += Math.min(2, Math.max(1, Math.floor(longRunDistance / 10)));
                if (easyRunCount % 2 == 1 && i > weeks - 3)
                    workoutDistance++;
                easyRunCount++;
            }
            else {
                var rawTempoDistance = Math.floor(longRunDistance * 0.4);
                var minTempoDistance = Math.floor(firstLongRun * 0.5);
                workoutDistance = Math.min(10, Math.max(rawTempoDistance, minTempoDistance));
                if (i == weeks)
                    workoutTypes[j] = 'easy';
            }
            if (i == weeks && workoutTypes[j] != 'race day')
                workoutDistance -= 2;
            workouts.push({
                day: workoutDays[j],
                workout: {
                    distance: workoutDistance,
                    description: workoutTypes[j]
                }
            })
        }
        trainingPlan.push({
            week: i,
            workouts: workouts
        });
    }
    const formattedDateAndTime = logger.getTimeAndDate();
    return { 
        createdAt: formattedDateAndTime,
        weeks: weeks,
        targetTime: targetTime,
        trainingPlan: trainingPlan,
    };
}

module.exports = {
    generateTrainingPlan,
};
  