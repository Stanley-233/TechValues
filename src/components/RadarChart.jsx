import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { AXES, AXE_LABELS } from '../utils/calculator';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function RadarChart({ scores }) {
  const labels = AXES.map(axis => AXE_LABELS[axis].left);
  const values = AXES.map(axis => scores[axis]);

  const data = {
    labels,
    datasets: [
      {
        label: '你的立场',
        data: values,
        backgroundColor: 'rgba(52, 152, 219, 0.2)',
        borderColor: 'rgba(52, 152, 219, 1)',
        borderWidth: 2,
        pointBackgroundColor: AXES.map(axis => AXE_LABELS[axis].color),
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const axis = AXES[context.dataIndex];
            const label = AXE_LABELS[axis];
            const value = context.raw;
            return `${label.left}: ${value}%`;
          }
        }
      }
    },
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
          display: false
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        angleLines: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        pointLabels: {
          font: { size: 13, weight: 'bold' },
          color: '#333'
        }
      }
    }
  };

  return (
    <div className="radar-chart">
      <Radar data={data} options={options} />
    </div>
  );
}
