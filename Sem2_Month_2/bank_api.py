from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from typing import Dict, List

app = FastAPI(title="Bank API")

# In-memory account store
accounts: Dict[str, float] = {}

# 📘 Models
class Account(BaseModel):
    id: str
    balance: float = 0.0

class Transaction(BaseModel):
    id: str
    amount: float

class Transfer(BaseModel):
    from_id: str
    to_id: str
    amount: float

class BatchDeposit(BaseModel):
    deposits: List[Transaction]

class BatchTransfer(BaseModel):
    transfers: List[Transfer]

# 🏗️ Core Functions
def create_account(account_id: str, balance: float):
    if account_id in accounts:
        return False
    accounts[account_id] = balance
    return True

def get_balance(account_id: str):
    return accounts.get(account_id)

def deposit(account_id: str, amount: float):
    if account_id not in accounts:
        return None
    accounts[account_id] += amount
    return accounts[account_id]

def withdraw(account_id: str, amount: float):
    if account_id not in accounts or accounts[account_id] < amount:
        return None
    accounts[account_id] -= amount
    return accounts[account_id]

def transfer(from_id: str, to_id: str, amount: float):
    if from_id not in accounts or to_id not in accounts:
        return "missing"
    if accounts[from_id] < amount:
        return "insufficient"
    accounts[from_id] -= amount
    accounts[to_id] += amount
    return "success"

# 🚪 Endpoints
@app.post("/create", status_code=status.HTTP_201_CREATED)
def create(account: Account):
    if not create_account(account.id, account.balance):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Account already exists")
    return {"message": "Account created", "balance": account.balance}

@app.get("/account/{id}")
def get_account(id: str):
    balance = get_balance(id)
    if balance is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")
    return {"id": id, "balance": balance}

@app.post("/deposit")
def deposit_funds(tx: Transaction):
    result = deposit(tx.id, tx.amount)
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")
    return {"message": "Deposit successful", "balance": result}

@app.post("/withdraw")
def withdraw_funds(tx: Transaction):
    result = withdraw(tx.id, tx.amount)
    if result is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Insufficient funds or account missing")
    return {"message": "Withdrawal successful", "balance": result}

@app.post("/transfer")
def transfer_funds(tx: Transfer):
    result = transfer(tx.from_id, tx.to_id, tx.amount)
    if result == "missing":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account missing")
    if result == "insufficient":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Insufficient funds")
    return {"message": "Transfer successful"}

@app.post("/batch/deposit")
def batch_deposit(batch: BatchDeposit):
    results = []
    for tx in batch.deposits:
        result = deposit(tx.id, tx.amount)
        results.append({tx.id: result if result is not None else "Account not found"})
    return {"results": results}

@app.post("/batch/transfer")
def batch_transfer(batch: BatchTransfer):
    results = []
    for tx in batch.transfers:
        result = transfer(tx.from_id, tx.to_id, tx.amount)
        results.append({f"{tx.from_id}->{tx.to_id}": result})
    return {"results": results}
