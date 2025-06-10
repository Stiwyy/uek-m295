// Functions get put at the top of the file
function addiere(a, b) {
    return a + b;
}

// A function that is declared like this can't be called before it is defined
const addiere1 = (a, b) => {
    return a + b;
};

const addiere2 = (a, b) => a + b;

console.log(addiere(1, 2));
console.log(addiere1(1, 2));
console.log(addiere2(1, 2));