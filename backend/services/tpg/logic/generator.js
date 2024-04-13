const planner = require('./planner');

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

    const interval = Math.round((peakLongRun - firstLongRun) / (weeks - 4) * 10) / 10;
    console.log(interval);

    var trainingPlan = new Array();
    for (let i = 0; i < weeks; i++) {
        
        var longRunDistance = (i < weeks - 3) ? 
            Math.floor(firstLongRun + (interval * i)) : 
            Math.floor((peakLongRun / 6) + (peakLongRun / 6) * (weeks - 1 - i));

        
        var easyRunCount = 0;
        var workouts = new Array();
        for (let j = 0; j < frequency; j++) {
            var workoutDistance;
            if (workoutTypes[j] == 'long') {
                workoutDistance = longRunDistance;
                if (i == weeks - 1) {
                    workoutTypes[j] = 'race day';
                    workoutDistance = 42.2;
                }
            }
            else if (workoutTypes[j] == 'easy') {
                var rawEasyDistance = Math.floor(longRunDistance * 0.5);
                var minEasyDistance = Math.floor(firstLongRun * 0.6);
                workoutDistance = Math.min(14, Math.max(rawEasyDistance, minEasyDistance));
                if (easyRunCount > 0)
                    workoutDistance += Math.min(2, Math.max(1, Math.floor(longRunDistance / 10)));
                easyRunCount++;
            }
            else {
                var rawTempoDistance = Math.floor(longRunDistance * 0.4);
                var minTempoDistance = Math.floor(firstLongRun * 0.5);
                workoutDistance = Math.min(12, Math.max(rawTempoDistance, minTempoDistance));
                if (i == weeks - 1)
                    workoutTypes[j] = 'easy';
            }
            workouts.push({
                day: workoutDays[j],
                workout: {
                    distance: workoutDistance,
                    description: workoutTypes[j]
                }
            })
        }
        trainingPlan.push({
            week: i+1,
            workouts: workouts
        });
    }
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
    const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    const formattedDateAndTime = `${formattedTime} ${formattedDate}`;

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
  