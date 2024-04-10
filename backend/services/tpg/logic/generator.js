// generate a training plan based on user input
function generateTrainingPlan(userInput) {
    console.log(userInput);

    const weeks = userInput.weeks;
    const frequency = userInput.frequency;
    const targetTime = userInput.targetTime;
    const firstLongRun = userInput.firstLongRun;
    const distance = userInput.distance;
    const longRunDay = userInput.longRunDay;

    const workoutDays = getWorkoutDays(frequency, longRunDay);
    const workoutTypes = getWorkoutTypes(frequency);

    for (let i = 0; i < weeks; i++) {
        console.log(`Week ${i+1}: `);
        for (let j = 0; j < frequency; j++) {
            console.log(` > ${workoutDays[j]}: ${workoutTypes[j]}`);
        }
    }

    return { "test": "pass" };
}

function getWorkoutDays(frequency, longRunDay) {

    if (longRunDay == 'saturday') {
        switch (frequency) {
            case 2: return ['wednesday', 'saturday'];
            case 3: return ['tuesday', 'thursday', 'saturday'];
            case 4: return ['monday', 'tuesday', 'thursday', 'saturday'];
            case 5: return ['monday', 'tuesday', 'wednesday', 'friday', 'saturday'];
            case 6: return ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            case 7: return ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
            default: return [];
        }
    } else {
        switch (frequency) {
            case 2: return ['thursday', 'sunday'];
            case 3: return ['tuesday', 'thursday', 'sunday'];
            case 4: return ['tuesday', 'wednesday', 'friday', 'sunday'];
            case 5: return ['tuesday', 'wednesday', 'thursday', 'saturday', 'saturday'];
            case 6: return ['tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
            case 7: return ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
            default: return [];
        }
    }

}

function getWorkoutTypes(frequency) {

    switch (frequency) {
        case 2: return ['easy', 'long'];
        case 3: return ['easy', 'tempo', 'long'];
        case 4: return ['easy', 'tempo', 'easy', 'long'];
        case 5: return ['easy', 'easy', 'tempo', 'easy', 'long'];
        case 6: return ['easy', 'easy', 'tempo', 'easy', 'easy', 'long'];
        case 7: return ['easy', 'easy', 'easy', 'tempo', 'easy', 'easy', 'long'];
        default: return [];
    }

}
  
module.exports = {
    generateTrainingPlan,
};
  