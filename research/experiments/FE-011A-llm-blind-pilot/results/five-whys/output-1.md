# Five Whys Output 1

- State the problem.
  A production server outage occurred during peak business hours.

- Why 1?
  Because the server ran out of memory and the production service became unavailable.

- Why 2?
  Because a recent deployment likely caused the application to consume more memory than expected.

- Why 3?
  Because the deployment appears to have introduced a defect or configuration change that was not detected before release.

- Why 4?
  Because deployment validation and operational safeguards were insufficient to catch the issue early.

- Why 5?
  Because incident preparation and release discipline were not strong enough to prevent or quickly recover from a bad production change.
