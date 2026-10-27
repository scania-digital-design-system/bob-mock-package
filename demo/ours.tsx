import { createRoot } from 'react-dom/client';
import '../tokens/scania.css';
import '../cells/react/badge/scania/v1/component.css';
import Badge from '../cells/react/badge/scania/v1/component.jsx';
import { BADGE_CASES } from './cases';

function Preview() {
  return (
    <dl className="cases">
      {BADGE_CASES.map(({ label, props }) => (
        <div className="case" key={label}>
          <dt>{label}</dt>
          <dd>
            <Badge {...props} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

const root = document.getElementById('root');
if (root === null) {
  throw new Error('demo: #root is missing');
}
createRoot(root).render(<Preview />);
