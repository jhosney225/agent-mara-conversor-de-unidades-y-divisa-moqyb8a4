
```javascript
const Anthropic = require("@anthropic-ai/sdk");
const readline = require("readline");

const client = new Anthropic();

// Tool definitions for unit and currency conversion
const tools = [
  {
    name: "convert_length",
    description:
      "Converts between different length units (meters, kilometers, feet, miles, inches, centimeters)",
    input_schema: {
      type: "object",
      properties: {
        value: {
          type: "number",
          description: "The value to convert",
        },
        from_unit: {
          type: "string",
          enum: [
            "meters",
            "kilometers",
            "feet",
            "miles",
            "inches",
            "centimeters",
          ],
          description: "The unit to convert from",
        },
        to_unit: {
          type: "string",
          enum: [
            "meters",
            "kilometers",
            "feet",
            "miles",
            "inches",
            "centimeters",
          ],
          description: "The unit to convert to",
        },
      },
      required: ["value", "from_unit", "to_unit"],
    },
  },
  {
    name: "convert_weight",
    description:
      "Converts between different weight units (kilograms, grams, pounds, ounces, tons)",
    input_schema: {
      type: "object",
      properties: {
        value: {
          type: "number",
          description: "The value to convert",
        },
        from_unit: {
          type: "string",
          enum: ["kilograms", "grams", "pounds", "ounces", "tons"],
          description: "The unit to convert from",
        },
        to_unit: {
          type: "string",
          enum: ["kilograms", "grams", "pounds", "ounces", "tons"],
          description: "The unit to convert to",
        },
      },
      required: ["value", "from_unit", "to_unit"],
    },
  },
  {
    name: "convert_temperature",
    description: "Converts between temperature units (celsius, fahrenheit, kelvin)",
    input_schema: {
      type: "object",
      properties: {
        value: {
          type: "number",
          description: "The value to convert",
        },
        from_unit: {
          type: "string",
          enum: ["celsius", "fahrenheit", "kelvin"],
          description: "The unit to convert from",
        },
        to_unit: {
          type: "string",
          enum: ["celsius", "fahrenheit", "kelvin"],
          description: "The unit to convert to",
        },
      },
      required: ["value", "from_unit", "to_unit"],
    },
  },
  {
    name: "convert_currency",
    description:
      "Converts between different currencies (USD, EUR, GBP, JPY, AUD, CAD, CHF, INR)",
    input_schema: {
      type: "object",
      properties: {
        amount: {
          type: "number",
          description: "The amount to convert",
        },
        from_currency: {
          type: "string",
          enum: ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "INR"],
          description: "The currency to convert from",
        },
        to_currency: {
          type: "string",
          enum: ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "INR"],
          description: "The currency to convert to",
        },
      },
      required: ["amount", "from_currency", "to_currency"],
    },
  },
];

// Conversion functions
function convertLength(value, fromUnit, toUnit) {
  // Convert to meters first
  const toMeters = {
    meters: 1,
    kilometers: 1000,
    feet: 0.3048,
    miles: 1609.34,
    inches: 0.0254,
    centimeters: 0.01,
  };

  const meters = value * toMeters[fromUnit];
  const result = meters / toMeters[toUnit];
  return parseFloat(result.toFixed(6));
}

function convertWeight(value, fromUnit, toUnit) {
  // Convert to kilograms first
  const toKilograms = {
    kilograms: 1,
    grams: 0.001,
    pounds: 0.453592,
    ounces: 0.0283495,
    tons: 1000,
  };

  const kilograms = value * toKilograms[fromUnit];
  const result = kilograms / toKilograms[toUnit];
  return parseFloat(result.toFixed(6));
}

function convertTemperature(value, fromUnit, toUnit) {
  let celsius;

  // Convert to Celsius first
  if (fromUnit === "celsius") {
    celsius = value;
  } else if (fromUnit === "fahrenheit") {
    celsius = ((value - 32) * 5) / 9;
  } else if (fromUnit === "kelvin") {
    celsius = value - 273.15;
  }

  // Convert from Celsius to target unit
  let result;
  if (toUnit === "celsius") {
    result = celsius;
  } else if (toUnit === "fahrenheit") {
    result = (celsius * 9) / 5 + 32;
  } else if (toUnit === "kelvin") {
    result = celsius + 273.15;
  }

  return parseFloat(result.toFixed(6));
}

function convertCurrency(amount, fromCurrency, toCurrency) {
  // Sample exchange rates (in production, these would be fetched from an API)
  const exchangeRates = {
    USD: 1.0,
    EUR: 0.92,
    GBP: