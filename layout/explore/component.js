import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';

// Components
import Layout from 'layout/layout/layout-app';

// Modal
import Modal from 'components/modal/modal-component';

// Explore components
import ExploreSidebar from 'layout/explore/explore-sidebar';
import ExploreMenu from 'layout/explore/explore-menu';
// import ExploreDatasetsHeader from 'layout/explore/explore-datasets-header';
import ExploreDatasets from 'layout/explore/explore-datasets';
import ExploreMap from 'layout/explore/explore-map';
import ExploreDetail from 'layout/explore/explore-detail';
import ExploreTopics from 'layout/explore/explore-topics';
import ExploreCollections from 'layout/explore/explore-collections';

// utils
import { breakpoints } from 'utils/responsive';
import { EXPLORE_SECTIONS } from './constants';

class Explore extends PureComponent {
  static propTypes = { responsive: PropTypes.object.isRequired };

  state = { mobileWarningOpened: true }

  render() {
    const {
      responsive,
      explore: { datasets: { selected }, sidebar: { section } }
    } = this.props;
    const { mobileWarningOpened } = this.state;
    return (
      <Layout
        title="Explore Data Sets — Resource Watch"
        description="Browse more than 200 global data sets on the state of our planet."
        className="-fullscreen"
      >
        <div className="c-page-explore">
          <ExploreSidebar>
            {!selected && (
              <Fragment>
                <ExploreMenu />
                <div className="explore-sidebar-content">
                  {section === EXPLORE_SECTIONS.ALL_DATA &&
                    <ExploreDatasets />
                  }
                  {section === EXPLORE_SECTIONS.TOPICS &&
                    <ExploreTopics />
                  }
                  {section === EXPLORE_SECTIONS.COLLECTIONS &&
                    <ExploreCollections />
                  }
                  {/* <ExploreDatasetsHeader /> */}
                </div>
              </Fragment>
            )}
            {selected && <ExploreDetail /> }
          </ExploreSidebar>

          {/* Mobile warning */}
          <MediaQuery
            maxDeviceWidth={breakpoints.medium}
            values={{ deviceWidth: responsive.fakeWidth }}
          >
            <Modal
              isOpen={mobileWarningOpened}
              onRequestClose={() => this.setState({ mobileWarningOpened: false })}
            >
              <div>
                <p>The mobile version of Explore has limited functionality,
                  please check the desktop version to have access to the
                  full list of features available.
                </p>
              </div>
            </Modal>
          </MediaQuery>

          {/* Desktop map */}
          <MediaQuery
            minDeviceWidth={breakpoints.medium}
            values={{ deviceWidth: responsive.fakeWidth }}
          >
            <ExploreMap />
          </MediaQuery>

        </div>
      </Layout>
    );
  }
}

export default Explore;
