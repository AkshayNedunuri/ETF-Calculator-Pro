
# WealthCalc India — Multi-Asset Investment Calculator

A comprehensive, modern, and responsive investment calculator built with Next.js, Tailwind CSS, and Recharts. Now expanded to support multiple asset classes.

## Features

-   **Multi-Asset Support**: Calculate returns for ETFs/Mutual Funds, Crypto, Real Estate, Bank FDs, and Loans.
-   **Asset-Specific Inputs**:
    -   **ETF/MF**: SIP, Lumpsum, Step-up SIP, Expense Ratio, Inflation.
    -   **Crypto**: DCA support with high-volatility projections.
    -   **Real Estate**: Property appreciation + Rental income calculations.
    -   **Bank FD**: Principal, Interest Rate, and flexible Compounding frequency.
    -   **Loans**: EMI calculator with total interest and payment breakdown.
-   **Smart Visualizations**:
    -   Interactive Line/Area Charts (Growth Trajectory, Amortisation, Property Value).
    -   Allocation Pie Charts for all asset types.
-   **Themes**: Premium Dark and Light mode UI.
-   **Data Persistence**: Automatically saves your inputs locally.
-   **Export**: Download tailored reports as PDF or share the link.

## Getting Started

### Prerequisites

-   Node.js 18+ installed.

### Installation

1.  Open a terminal in the project directory.
2.  Install dependencies:
    ```bash
    npm install
    # If you encounter issues on Windows/OneDrive, try:
    # npm install --no-bin-links
    ```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

```bash
npm run build
npm start
```

## Troubleshooting

If you encounter `Next.js` or `npm ` errors on Windows (especially with OneDrive):
1.  Try deleting `node_modules` and `package-lock.json`.
2.  Run `npm install --no-bin-links`.
3.  If `npm run dev` fails, try running `npx next dev` or `node node_modules/next/dist/bin/next dev` directly.
