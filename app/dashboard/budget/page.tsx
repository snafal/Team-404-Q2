"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/components/auth-provider"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

export default function BudgetPage() {
  const { user } = useAuth()

  // Initial budget is Rs.9,000,000
  const initialBudget = 9000000
  const remainingBudget = user?.budget || initialBudget
  const spentBudget = initialBudget - remainingBudget
  const spentPercentage = (spentBudget / initialBudget) * 100

  // Group players by role for budget breakdown
  const playersByRole: Record<string, { count: number; spent: number }> = {
    Batsman: { count: 0, spent: 0 },
    Bowler: { count: 0, spent: 0 },
    "All-Rounder": { count: 0, spent: 0 },
    "Wicket Keeper": { count: 0, spent: 0 },
  }

  user?.team?.forEach((player) => {
    if (playersByRole[player.role]) {
      playersByRole[player.role].count += 1
      playersByRole[player.role].spent += player.value
    }
  })

  // Prepare data for pie chart
  const pieData = Object.entries(playersByRole)
    .filter(([_, data]) => data.spent > 0)
    .map(([role, data]) => ({
      name: role,
      value: data.spent,
    }))

  // Add remaining budget to pie chart if there is any
  if (remainingBudget > 0) {
    pieData.push({
      name: "Remaining",
      value: remainingBudget,
    })
  }

  // Colors for pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Budget</h1>
        <p className="text-muted-foreground">Track your team budget and spending</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Budget Overview</CardTitle>
            <CardDescription>Your budget allocation and remaining funds</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Budget Used</span>
                  <span className="text-sm font-medium">{spentPercentage.toFixed(1)}%</span>
                </div>
                <Progress value={spentPercentage} className="h-2 mt-2" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-muted p-4">
                  <div className="text-sm font-medium text-muted-foreground">Initial Budget</div>
                  <div className="text-2xl font-bold">Rs. {initialBudget.toLocaleString()}</div>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <div className="text-sm font-medium text-muted-foreground">Remaining</div>
                  <div className="text-2xl font-bold">Rs. {remainingBudget.toLocaleString()}</div>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <div className="text-sm font-medium text-muted-foreground">Spent</div>
                  <div className="text-2xl font-bold">Rs. {spentBudget.toLocaleString()}</div>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <div className="text-sm font-medium text-muted-foreground">Players Selected</div>
                  <div className="text-2xl font-bold">{user?.team?.length || 0}/11</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget Distribution</CardTitle>
            <CardDescription>How your budget is allocated across player roles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `Rs. ${Number(value).toLocaleString()}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Player Expenses</CardTitle>
          <CardDescription>Detailed breakdown of your spending on each player</CardDescription>
        </CardHeader>
        <CardContent>
          {user?.team?.length === 0 ? (
            <p className="text-center py-4">You haven't selected any players yet.</p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>University</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Value (Rs.)</TableHead>
                    <TableHead className="text-right">% of Budget</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user?.team?.map((player) => (
                    <TableRow key={player.id}>
                      <TableCell className="font-medium">{player.name}</TableCell>
                      <TableCell>{player.university}</TableCell>
                      <TableCell>{player.role}</TableCell>
                      <TableCell className="text-right">{player.value.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{((player.value / initialBudget) * 100).toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Spending by Role</CardTitle>
          <CardDescription>Budget allocation across different player roles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Players</TableHead>
                  <TableHead className="text-right">Total Spent (Rs.)</TableHead>
                  <TableHead className="text-right">% of Spent Budget</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(playersByRole).map(([role, data]) => (
                  <TableRow key={role}>
                    <TableCell className="font-medium">{role}</TableCell>
                    <TableCell className="text-right">{data.count}</TableCell>
                    <TableCell className="text-right">{data.spent.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      {spentBudget === 0 ? "0.0" : ((data.spent / spentBudget) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell className="font-medium">Total</TableCell>
                  <TableCell className="text-right">{user?.team?.length || 0}</TableCell>
                  <TableCell className="text-right">{spentBudget.toLocaleString()}</TableCell>
                  <TableCell className="text-right">100.0%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

