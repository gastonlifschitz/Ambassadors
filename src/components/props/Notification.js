import PropTypes from 'prop-types';
import ownerShape from './Owner';

export default PropTypes.shape({
  tag: PropTypes.oneOf(['creation', 'edit', 'revision', 'approval', 'completion', 'completionReminder', 'cancellation']).isRequired,
  timestamp: PropTypes.string.isRequired,
  author: ownerShape,
  description: PropTypes.string
});
