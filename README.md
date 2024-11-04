# Dmoney API Automation using Mocha and Axios
### Project Summary: This project automates testing for the Dmoney API using Mocha and Axios. It includes test cases for user login, fund transfers, deposits, withdrawals, and balance checks across different user roles (Customer, Agent, Merchant). The project is set up with environment variables for secure data handling and generates detailed test reports with Mochawesome for easy result analysis.

### Technologies I have used: 
- Language: JavaScript
- Build System: npm
- Testing Frameworks: Mocha and Chai for test management; Axios for API requests
- IDE: VS Code
- Data Management: .env file for storing base URL, secret key, and token; JSON files for managing customer and agent data to facilitate API transactions.
  
### Project Flow:
- Setup: Configure environment with API credentials.
- Authentication: Admin login retrieves authorization token.
- User Management: Create customers and agents, storing details for transactions.
- Transactions: Execute fund transfers, deposits, withdrawals, and payments between users.
- Balance Check: Verify customer balance for transaction accuracy.
- Reporting: Generate test reports with Mochawesome for results overview.

### How to run?
1. Create Project Folder: Create a new folder for the project and open it in VS Code.
2. Install Dependencies: Run ```npm i``` in the terminal to install all required packages.
3. Configure Environment: Create a .env file in the project root and add API credentials (base URL, token, secret key).
4. Run Tests:
   - Open the terminal in the project root.
   - Run ```npx mocha ./DmoneyAPI.test.js``` to execute the test file.
5. Generate Report:
   - Ensure mochawesome is installed by running ```npm i mochawesome```
   - Generate the report with ```npm test file ./DmoneyAPI.test.js ```
                                       

### Mochawesome Report View:
<img width="947" alt="Screenshot 2024-11-04 220149" src="https://github.com/user-attachments/assets/f2d69952-6a6a-44f4-8f7b-4e96660e5669">





