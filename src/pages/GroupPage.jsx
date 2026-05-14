import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function GroupPage() {
  const navigate = useNavigate()
  const [groupName, setGroupName] = useState('')
  const [members, setMembers] = useState([{ name: '' }])
  const [expenses, setExpenses] = useState([])
  const [newExpense, setNewExpense] = useState({
    amount: '',
    payer: '',
    description: '',
    category: 'Food',
    splitType: 'Equal',
  })
  const [balances, setBalances] = useState({})

  const addMember = () => {
    if (members.length < 5) {
      setMembers([...members, { name: '' }])
    }
  }

  const updateMember = (index, value) => {
    const updated = [...members]
    updated[index].name = value
    setMembers(updated)
  }

  const createGroup = () => {
    const validMembers = members.filter((m) => m.name.trim())
    if (validMembers.length < 2) {
      alert('Add at least 2 members')
      return
    }
    alert('Group created successfully!')
  }

  const calculateBalances = (allExpenses) => {
    const validMembers = members.filter((m) => m.name.trim())
    const memberBalances = {}

    validMembers.forEach((member) => {
      memberBalances[member.name] = 0
    })

    allExpenses.forEach((expense) => {
      const share = validMembers.length ? expense.amount / validMembers.length : 0

      validMembers.forEach((member) => {
        if (member.name === expense.payer) {
          memberBalances[member.name] += expense.amount - share
        } else {
          memberBalances[member.name] -= share
        }
      })
    })

    setBalances(memberBalances)
  }

  const addExpense = (e) => {
    e.preventDefault()

    if (!newExpense.amount || !newExpense.payer) return

    const expense = {
      ...newExpense,
      id: Date.now(),
      amount: Number(newExpense.amount),
      date: new Date().toISOString(),
    }

    const updatedExpenses = [expense, ...expenses]
    setExpenses(updatedExpenses)

    setNewExpense({
      amount: '',
      payer: '',
      description: '',
      category: 'Food',
      splitType: 'Equal',
    })

    calculateBalances(updatedExpenses)
  }

  useEffect(() => {
    calculateBalances(expenses)
  }, [members])

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
          >
            ← Back to Dashboard
          </button>

          <button
            onClick={createGroup}
            className="px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all"
          >
            Save Group
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold mb-6">Group Details</h2>

            <input
              type="text"
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-xl mb-6 text-xl font-semibold"
            />

            <h3 className="text-lg font-semibold mb-4">Members (Max 5)</h3>

            <div className="space-y-3">
              {members.map((member, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Member ${index + 1}`}
                  value={member.name}
                  onChange={(e) => updateMember(index, e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl"
                />
              ))}

              {members.length < 5 && (
                <button
                  onClick={addMember}
                  className="w-full p-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 transition-all"
                >
                  + Add Member
                </button>
              )}
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold mb-6">Balances</h2>

            <div className="space-y-3">
              {Object.keys(balances).length === 0 ? (
                <p className="text-gray-500">No balances yet.</p>
              ) : (
                Object.entries(balances).map(([name, balance]) => (
                  <div key={name} className="flex justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="font-medium">{name}</span>
                    <span className={balance >= 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                      ₹{Math.abs(balance).toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-xl mb-12">
          <h2 className="text-2xl font-bold mb-6">Add Expense</h2>

          <form onSubmit={addExpense} className="grid md:grid-cols-2 gap-6">
            <input
              type="number"
              placeholder="Amount (₹)"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              className="p-4 border border-gray-200 rounded-xl text-xl"
              required
            />

            <select
              value={newExpense.payer}
              onChange={(e) => setNewExpense({ ...newExpense, payer: e.target.value })}
              className="p-4 border border-gray-200 rounded-xl"
              required
            >
              <option value="">Who paid?</option>
              {members
                .filter((m) => m.name.trim())
                .map((member, index) => (
                  <option key={index} value={member.name}>
                    {member.name}
                  </option>
                ))}
            </select>

            <input
              type="text"
              placeholder="Description"
              value={newExpense.description}
              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              className="p-4 border border-gray-200 rounded-xl md:col-span-2"
            />

            <select
              value={newExpense.category}
              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              className="p-4 border border-gray-200 rounded-xl"
            >
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Stay">Stay</option>
              <option value="Utilities">Utilities</option>
              <option value="Shopping">Shopping</option>
            </select>

            <select
              value={newExpense.splitType}
              onChange={(e) => setNewExpense({ ...newExpense, splitType: e.target.value })}
              className="p-4 border border-gray-200 rounded-xl"
            >
              <option value="Equal">Equal Split</option>
              <option value="Custom">Custom Split</option>
            </select>

            <button
              type="submit"
              className="md:col-span-2 bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all"
            >
              Add Expense
            </button>
          </form>
        </div>

        {expenses.length > 0 && (
          <div className="bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold mb-6">Recent Expenses</h2>

            <div className="space-y-4">
              {expenses.map((expense) => (
                <div key={expense.id} className="flex flex-col md:flex-row gap-4 p-6 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <p className="text-xl font-bold">₹{expense.amount}</p>
                    <p className="text-gray-600">{expense.description || 'No description'}</p>
                    <p className="text-sm text-gray-500">
                      {expense.category} • {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <span>Paid by: {expense.payer}</span>
                    <span>{expense.splitType}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GroupPage