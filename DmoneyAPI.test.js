import { expect } from 'chai';
import axios from 'axios';
import dotenv from 'dotenv';
import storeToken from './setEnvVar.js';
dotenv.config();
import { faker } from '@faker-js/faker';
import generateRandomId from './Utils.js'
import jsonData from './userData.json' assert { type: 'json' };
import fs from 'fs'

describe("Dmoney API Automation", async ()=>{
 
 it("User login with valid creds", async ()=>{
    const {data} = await axios.post(`${process.env.base_url}/user/login`, {
        "email": "admin@roadtocareer.net",
        "password": "1234",
    },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        });

    // Log the response data to verify the output
    console.log(data);

    expect(data.message).to.contains("Login successful"); //assertion syntax
    storeToken('token', data.token);
})

it("Create First Customer", async ()=>{
    const { data } = await axios.post(`${process.env.base_url}/user/create`, {
        "name": `Axios user ${faker.person.firstName()}`,
        "email": `${faker.internet.email()}`,
        "password": "1234",
        "phone_number": `01502${generateRandomId(100000, 999999)}`,
        "nid": "123456789",
        "role": "Customer"
    },
        {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${process.env.token}`,
                "X-AUTH-SECRET-KEY":`${process.env.secretKey}`
            }
        });
    console.log(data);
    expect(data.message).to.equal("User created");

    jsonData.push(data.user);
    fs.writeFileSync('./userData.json', JSON.stringify(jsonData, null, 2)); 

})


it("Create Second Customer", async () => {
    const { data } = await axios.post(`${process.env.base_url}/user/create`, {
        "name": `Customer ${faker.person.firstName()}`,
        "email": `${faker.internet.email()}`,
        "password": "1234",
        "phone_number": `01803${generateRandomId(100000, 999999)}`,
        "nid": "987654321",
        "role": "Customer"
    }, {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${process.env.token}`,
            "X-AUTH-SECRET-KEY": `${process.env.secretKey}`
        }
    });
    console.log(data);
    expect(data.message).to.equal("User created");

    jsonData.push(data.user);
    fs.writeFileSync('./userData.json', JSON.stringify(jsonData, null, 2));
});

it("Create an Agent", async () => {
    const { data } = await axios.post(`${process.env.base_url}/user/create`, {
        "name": `Agent ${faker.person.firstName()}`,
        "email": `${faker.internet.email()}`,
        "password": "1234",
        "phone_number": `01904${generateRandomId(100000, 999999)}`,
        "nid": "192837465",
        "role": "Agent"
    }, {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${process.env.token}`,
            "X-AUTH-SECRET-KEY": `${process.env.secretKey}`
        }
    });
    console.log(data);
    expect(data.message).to.equal("User created");

    jsonData.push(data.user);
    fs.writeFileSync('./userData.json', JSON.stringify(jsonData, null, 2));
});

it("Create a Merchant", async () => {
    const { data } = await axios.post(`${process.env.base_url}/user/create`, {
        "name": `Merchant ${faker.person.firstName()}`,
        "email": `${faker.internet.email()}`,
        "password": "1234",
        "phone_number": `01700${generateRandomId(100000, 999999)}`,
        "nid": "987654321",
        "role": "Merchant"
    }, {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${process.env.token}`,
            "X-AUTH-SECRET-KEY": `${process.env.secretKey}`
        }
    });

    console.log(data);
    expect(data.message).to.equal("User created");

    // Save merchant data to userData.json
    jsonData.push(data.user);
    fs.writeFileSync('./userData.json', JSON.stringify(jsonData, null, 2));
});



it("Deposit 2000 BDT from System to Agent", async () => {
    const agentPhoneNumber = jsonData.find(user => user.role === "Agent").phone_number;  // Get agent phone number from JSON data

    const { data } = await axios.post(`${process.env.base_url}/transaction/deposit`, {
        "from_account": "SYSTEM",
        "to_account": agentPhoneNumber,  // Use agent's phone number for the transfer
        "amount": 2000
    }, {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${process.env.token}`,
            "X-AUTH-SECRET-KEY": `${process.env.secretKey}`
        }
    });

    console.log(data);
    expect(data.message).to.equal("Deposit successful");
});

it("Deposit 1500 BDT from Agent to Customer", async () => {
    const agentPhoneNumber = jsonData.find(user => user.role === "Agent").phone_number;  // Get agent phone number
    const customerPhoneNumber = jsonData.find(user => user.role === "Customer").phone_number;  // Get customer phone number

    const { data } = await axios.post(`${process.env.base_url}/transaction/deposit`, {
        "from_account": agentPhoneNumber,   // Use agent's phone number
        "to_account": customerPhoneNumber,  // Use customer's phone number
        "amount": 1500
    }, {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${process.env.token}`,
            "X-AUTH-SECRET-KEY": `${process.env.secretKey}`
        }
    });

    console.log(data);
    expect(data.message).to.equal("Deposit successful");
});

it("Customer withdraws 500 BDT to the Agent", async () => {
    const customerPhoneNumber = jsonData.find(user => user.role === "Customer").phone_number;  // Get customer phone number
    const agentPhoneNumber = jsonData.find(user => user.role === "Agent").phone_number;  // Get agent phone number

    const { data } = await axios.post(`${process.env.base_url}/transaction/withdraw`, {
        "from_account": customerPhoneNumber,  // Use customer's phone number
        "to_account": agentPhoneNumber,       // Use agent's phone number
        "amount": 500
    }, {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${process.env.token}`,
            "X-AUTH-SECRET-KEY": `${process.env.secretKey}`
        }
    });

    console.log(data);
    expect(data.message).to.equal("Withdraw successful");
});

it("Send 500 BDT from one Customer to another", async () => {
    const customers = jsonData.filter(user => user.role === "Customer");
    const customer1PhoneNumber = customers[0].phone_number;  // First customer phone number
    const customer2PhoneNumber = customers[1].phone_number;  // Second customer phone number

    const { data } = await axios.post(`${process.env.base_url}/transaction/sendmoney`, {
        "from_account": customer1PhoneNumber,  // Use first customer's phone number
        "to_account": customer2PhoneNumber,    // Use second customer's phone number
        "amount": 500
    }, {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${process.env.token}`,
            "X-AUTH-SECRET-KEY": `${process.env.secretKey}`
        }
    });

    console.log(data);
    expect(data.message).to.equal("Send money successful");
});

it("Recipient Customer pays 100 BDT to a Merchant", async () => {
    const customer = jsonData.find(user => user.role === "Customer");
    const merchant = jsonData.find(user => user.role === "Merchant");

    const { data } = await axios.post(`${process.env.base_url}/transaction/payment`, {
        "from_account": customer.phone_number,
        "to_account": merchant.phone_number, // Merchant's phone number
        "amount": 100
    }, {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${process.env.token}`,
            "X-AUTH-SECRET-KEY": `${process.env.secretKey}`
        }
    });

    console.log(data);
    expect(data.message).to.equal("Payment successful");
});

it("Check Recipient Customer's balance", async () => {
    const secondCustomer = jsonData.filter(user => user.role === "Customer")[1];
    const customerPhoneNumber = secondCustomer.phone_number;  // Second customer's phone number

    const { data } = await axios.get(`${process.env.base_url}/transaction/balance/${customerPhoneNumber}`, {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${process.env.token}`,
            "X-AUTH-SECRET-KEY": `${process.env.secretKey}`
        }
    });

    console.log(data);
    expect(data.message).to.equal("User balance");
    expect(data.balance).to.be.a("number");
});



})
