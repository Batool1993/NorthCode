import PropTypes from 'prop-types';
import { Box } from '@material-ui/core';
import PropertyReviewsSummary from './PropertyReviewsSummary';
import PropertyReviewCard from './PropertyReviewCard';

const PropertyReviews = (props) => {
  const { reviews, ...other } = props;

  const rating = reviews.reduce((acc, review) => acc + review.value, 0) / reviews.length;

  return (
    <div {...other}>
      <PropertyReviewsSummary
        rating={rating}
        reviewsCount={reviews.length}
      />
      {reviews.map((review) => (
        <Box
          key={review.id}
          sx={{ mt: 2 }}
        >
          <PropertyReviewCard
            authorAvatar={review.author.avatar}
            authorName={review.author.name}
            comment={review.comment}
            createdAt={review.createdAt}
            value={review.value}
          />
        </Box>
      ))}
    </div>
  );
};

PropertyReviews.propTypes = {
  reviews: PropTypes.array
};

export default PropertyReviews;
