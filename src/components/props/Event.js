import PropTypes from 'prop-types';
import ownerShape from './Owner';
import notificationShape from './Notification';

export default PropTypes.shape({
  completed: PropTypes.string,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired, // TODO: feo que sea string
  content: PropTypes.string,
  feedback: PropTypes.string,
  picturesLink: PropTypes.string,

  // Los eventos viejos no lo tienen 
  notifications: PropTypes.arrayOf(notificationShape),

  location: PropTypes.shape({
    institution: PropTypes.string.isRequired,
    address: PropTypes.string
  }).isRequired,

  owner: ownerShape.isRequired,

  assistants: PropTypes.shape({
    expected: PropTypes.number.isRequired,
    actual: PropTypes.number
  }).isRequired,
});