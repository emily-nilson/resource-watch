import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { getPartners } from 'redactions/partners';

// Components
import Page from 'components/app/layout/Page';
import Layout from 'components/app/layout/Layout';
import Title from 'components/ui/Title';
import PartnerBlock from 'components/app/common/Partners/PartnerBlock';
import Banner from 'components/app/common/Banner';
import Breadcrumbs from 'components/ui/Breadcrumbs';


class Partners extends Page {
  componentWillMount() {
    this.props.getPartners();
  }

  render() {
    const founders = this.props.list.filter(p => p.attributes['partner-type'] === 'founding_partners');
    const funders = this.props.list.filter(p => p.attributes['partner-type'] === 'funders');

    return (
      <Layout
        title="Partners"
        description="Partners description"
        url={this.props.url}
        user={this.props.user}
      >
        <div className="c-page-header">
          <div className="l-container">
            <div className="page-header-content">
              <Breadcrumbs
                items={[{ name: 'About', route: 'about' }]}
              />

              <Title className="-primary -huge page-header-title" >
                Partners
              </Title>
            </div>
          </div>
        </div>

        <section className="l-section">
          <header className="l-section-header">
            <div className="l-container">
              <div className="row">
                <div className="column small-12">
                  <h2 className="c-text -header-big -primary -thin">
                    We have a massive opportunity {<br />} to build a sustainable society
                  </h2>
                  <p className="-columnize">
                    Resource Watch brings together leading technology companies and data providers
                    dedicated to making new streams of data actionable. This powerful coupling
                    allows for seamless exploration of trusted, decision-relevant data
                    from remote sensing systems, peer-reviewed research, and other sources.
                    State-of-the-art technology and data services support open-access
                    web and mobile apps to deliver insightful data to the people that need it.
                  </p>
                </div>
              </div>
            </div>
          </header>
        </section>

        <div className="p-partners">
          <div className="c-page">
            <section className="l-section -partners -first">
              <div className="l-container">
                <div className="row">
                  <div className="column small-12">
                    <h2 className="title c-text -huger -primary -thin">Founding partners</h2>
                  </div>
                </div>
                <div className="row">
                  {founders.map(p => <PartnerBlock key={p.id} item={p} />)}
                </div>
              </div>
            </section>

            <section className="l-section -partners">
              <div className="l-container">
                <div className="row">
                  <div className="column small-12">
                    <h2 className="title c-text -huger -primary -thin">Funders</h2>
                  </div>
                </div>
                <div className="row">
                  {funders.map(p => <PartnerBlock key={p.id} item={p} />)}
                </div>
              </div>
            </section>

            <div className="row">
              <div className="column small-12">
                <Banner>
                  <h3 className="c-text -header-normal -normal">
                    See yourself as part<br /> of this team?
                  </h3>
                  <button className="c-btn -primary -filled">
                    Get in touch
                  </button>
                </Banner>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

Partners.propTypes = {
  list: PropTypes.array.isRequired,
  getPartners: PropTypes.func
};

Partners.defaultProps = {
  list: []
};

const mapStateToProps = state => ({
  list: state.partners.list
});

const mapDispatchToProps = dispatch => ({
  getPartners: () => { dispatch(getPartners()); }
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Partners);
