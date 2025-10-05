export const BUDGET_PLANNER = {
  // Header
  header: {
    title: 'Set Up Your Budget',
    subtitle: 'Configure your financial goals and start tracking your expenses',
    icons: {
      smartBudgeting: 'Smart Budgeting',
      trackExpenses: 'Track Expenses',
      financialGoals: 'Financial Goals'
    }
  },

  // Navigation
  navigation: {
    manageTransactions: 'Manage Transactions →'
  },

  // Form Labels - New Cycle
  newCycle: {
    budgetLabel: 'Monthly Budget',
    startDateLabel: 'Start Date',
    endDateLabel: 'End Date',
    budgetRemainingLabel: 'Budget Remaining',
    summaryLabel: 'Total Budget',
    budgetPeriodLabel: 'Budget period',
    daysLabel: 'days'
  },

  // Form Labels - Modify Existing
  modifyExisting: {
    currentBudgetLabel: 'Current Budget:',
    alreadySpentLabel: 'Already Spent:',
    currentRemainingLabel: 'Current Remaining:',
    increaseBudgetLabel: 'Increase Budget By',
    newBudgetTotalLabel: 'New Budget Total:',
    newRemainingLabel: 'New Remaining:'
  },

  // Placeholders
  placeholders: {
    budgetAllocated: 'Enter your total budget amount',
    additionalBudget: 'Enter amount to add',
    budgetRemaining: 'Will be set automatically'
  },

  // Help Text
  helpText: {
    budgetRemaining: 'This will be automatically calculated based on your budget allocation'
  },

  // Buttons
  buttons: {
    setupBudget: 'Set Up Budget',
    updateBudget: 'Update Budget'
  },

  // Error Messages
  errors: {
    budgetRequired: 'Budget amount is required and must be greater than 0',
    additionalBudgetInvalid: 'Amount must be greater than or equal to 0',
    startDateRequired: 'Start date is required',
    endDateRequired: 'End date is required',
    dateRangeInvalid: 'End date must be after start date'
  },

  // Required Indicator
  required: '*'
};

