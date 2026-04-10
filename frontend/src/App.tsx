import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type MetricType =
  | 'heartRate'
  | 'steps'
  | 'sleepHours'
  | 'calories'
  | 'weight'
  | 'bloodPressureSys'
  | 'bloodPressureDia'
  | 'glucose'

interface MetricOption {
  key: MetricType
  label: string
  inputType: 'int' | 'float'
}

interface HealthMetric {
  id: number
  userId: number
  date: string
  heartRate: number | null
  steps: number | null
  sleepHours: number | null
  calories: number | null
  weight: number | null
  bloodPressureSys: number | null
  bloodPressureDia: number | null
  glucose: number | null
  createdAt: string
}

interface MetricFormState {
  metricType: MetricType
  date: string
  value: string
}

declare global {
  interface Window {
    Chart: {
      new (context: CanvasRenderingContext2D, config: unknown): { destroy: () => void }
    }
  }
}

const metricOptions: MetricOption[] = [
  { key: 'heartRate', label: 'Heart Rate (bpm)', inputType: 'int' },
  { key: 'steps', label: 'Steps', inputType: 'int' },
  { key: 'sleepHours', label: 'Sleep Hours', inputType: 'float' },
  { key: 'calories', label: 'Calories', inputType: 'int' },
  { key: 'weight', label: 'Weight (kg)', inputType: 'float' },
  { key: 'bloodPressureSys', label: 'Blood Pressure Systolic', inputType: 'int' },
  { key: 'bloodPressureDia', label: 'Blood Pressure Diastolic', inputType: 'int' },
  { key: 'glucose', label: 'Glucose', inputType: 'int' },
]

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api'

function App() {
  const [token, setToken] = useState('')
  const [metrics, setMetrics] = useState<HealthMetric[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formState, setFormState] = useState<MetricFormState>({
    metricType: 'steps',
    date: new Date().toISOString().slice(0, 10),
    value: '',
  })
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null)

  const selectedOption = useMemo(
    () => metricOptions.find((option) => option.key === formState.metricType),
    [formState.metricType],
  )

  const chartData = useMemo(
    () =>
      metrics
        .filter((metric) => metric[formState.metricType] !== null)
        .map((metric) => ({
          date: new Date(metric.date).toLocaleDateString(),
          value: Number(metric[formState.metricType]),
        }))
        .reverse(),
    [metrics, formState.metricType],
  )

  useEffect(() => {
    if (!chartCanvasRef.current || chartData.length === 0 || typeof window.Chart === 'undefined') {
      return
    }

    const context = chartCanvasRef.current.getContext('2d')

    if (!context) {
      return
    }

    const chart = new window.Chart(context, {
      type: 'line',
      data: {
        labels: chartData.map((point) => point.date),
        datasets: [
          {
            label: selectedOption?.label ?? 'Metric',
            data: chartData.map((point) => point.value),
            borderColor: '#1d4ed8',
            backgroundColor: 'rgba(29, 78, 216, 0.15)',
            borderWidth: 2,
            fill: true,
            tension: 0.2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { ticks: { maxRotation: 0 } },
        },
      },
    })

    return () => {
      chart.destroy()
    }
  }, [chartData, selectedOption?.label])

  const fetchMetrics = async () => {
    if (!token.trim()) {
      setError('Add a JWT token to load data from the backend API.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${apiBaseUrl}/metrics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch metrics (${response.status})`)
      }

      const data: HealthMetric[] = await response.json()
      setMetrics(data)
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Unable to fetch metrics.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (token.trim()) {
      void fetchMetrics()
    }
  }, [token])

  const handleCreateMetric = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!token.trim()) {
      setError('JWT token is required before creating a metric.')
      return
    }

    const parsedValue =
      selectedOption?.inputType === 'float' ? Number.parseFloat(formState.value) : Number.parseInt(formState.value, 10)

    if (Number.isNaN(parsedValue)) {
      setError('Metric value must be a valid number.')
      return
    }

    const payload: Record<string, number | string> = { date: formState.date }
    payload[formState.metricType] = parsedValue

    setError(null)

    try {
      const response = await fetch(`${apiBaseUrl}/metrics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Failed to create metric (${response.status})`)
      }

      setFormState((prevState) => ({ ...prevState, value: '' }))
      await fetchMetrics()
    } catch (postError) {
      setError(postError instanceof Error ? postError.message : 'Unable to create metric.')
    }
  }

  return (
    <main className="app-shell">
      <h1>Health Metrics Tracker</h1>
      <p className="description">Create metrics, view your history, and chart progress from the backend API.</p>

      <section className="panel">
        <h2>API Access</h2>
        <label htmlFor="token">JWT Token</label>
        <div className="row">
          <input
            id="token"
            type="password"
            placeholder="Paste your JWT token"
            value={token}
            onChange={(event) => setToken(event.target.value)}
          />
          <button type="button" onClick={() => void fetchMetrics()}>
            Refresh
          </button>
        </div>
      </section>

      <section className="panel">
        <h2>Add Metric Entry</h2>
        <form className="metric-form" onSubmit={handleCreateMetric}>
          <label htmlFor="metricType">Metric Type</label>
          <select
            id="metricType"
            value={formState.metricType}
            onChange={(event) =>
              setFormState((prevState) => ({
                ...prevState,
                metricType: event.target.value as MetricType,
              }))
            }
          >
            {metricOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>

          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            value={formState.date}
            onChange={(event) => setFormState((prevState) => ({ ...prevState, date: event.target.value }))}
            required
          />

          <label htmlFor="value">Value</label>
          <input
            id="value"
            type="number"
            step={selectedOption?.inputType === 'float' ? '0.1' : '1'}
            value={formState.value}
            onChange={(event) => setFormState((prevState) => ({ ...prevState, value: event.target.value }))}
            placeholder="Enter value"
            required
          />

          <button type="submit">Save Entry</button>
        </form>
        {error ? <p className="error">{error}</p> : null}
      </section>

      <section className="panel">
        <h2>{selectedOption?.label} Trend</h2>
        <div className="chart-wrapper">
          {chartData.length === 0 ? (
            <p className="muted">No values for this metric yet.</p>
          ) : (
            <canvas ref={chartCanvasRef} />
          )}
        </div>
      </section>

      <section className="panel">
        <h2>Entries</h2>
        <p className="muted">{isLoading ? 'Loading…' : `${metrics.length} records loaded`}</p>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                {metricOptions.map((option) => (
                  <th key={option.key}>{option.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric) => (
                <tr key={metric.id}>
                  <td>{new Date(metric.date).toLocaleDateString()}</td>
                  {metricOptions.map((option) => (
                    <td key={option.key}>{metric[option.key] ?? '—'}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

export default App
