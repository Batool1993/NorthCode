import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import PropertyApplicantCard from './PropertyApplicantCard';

const PropertyApplicants = (props) => {
  const { applicants, ...other } = props;

  return (
    <Grid
      container
      spacing={3}
      {...other}
    >
      {applicants.map((applicant) => (
        <Grid
          item
          key={applicant.id}
          lg={4}
          xs={12}
        >
          <PropertyApplicantCard
            avatar={applicant.avatar}
            cover={applicant.cover}
            name={applicant.name}
            skills={applicant.skills}
          />
        </Grid>
      ))}
    </Grid>
  );
};

PropertyApplicants.propTypes = {
  applicants: PropTypes.array.isRequired
};

export default PropertyApplicants;
