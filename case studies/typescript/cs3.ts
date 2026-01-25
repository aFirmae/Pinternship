function weatherReport(city: string, temperature: number, isRaining: any): void {
    console.log(`In ${city}, it is ${temperature}°C. Is it raining? ${isRaining}`);
}

let city: string = "Calcutta";
let temperature: number = 22;
let isRaining = false;

weatherReport(city, temperature, isRaining);