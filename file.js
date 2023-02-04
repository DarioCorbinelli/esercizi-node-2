class Bike {
  constructor() {
    this.wheel1 = null
    this.wheel2 = null
  }
  
  setWheel1(wheel) {
    this.wheel1 = wheel
  }
  setWheel2(wheel) {
    this.wheel2 = wheel
  }

  specification() {
    let message = `${this.wheel1.label} wheel diameter = ${this.wheel1.diameter}`;
    message += `, ${this.wheel2.label} wheel diameter = ${this.wheel2.diameter}`;

    return message;
  }
}

class Wheel {
  constructor(label, diameter) {
    this.label = label;
    this.diameter = diameter;
  }
}

const frontWheel = new Wheel("Front", 126);
const backWheel = new Wheel("Back", 42);

const bike = new Bike();
bike.setWheel1(frontWheel)
bike.setWheel2(backWheel)

console.log(bike);

console.log("Bike specification:", bike.specification());