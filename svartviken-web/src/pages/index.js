import React from 'react'
import { Link, graphql } from 'gatsby'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import Plyr from 'react-plyr'

import Bio from '../components/Bio'
import Layout from '../components/layout'
import { rhythm } from '../utils/typography'
import AudioPlayer from '../components/AudioPlayer'
import 'bulma/css/bulma.css'

class BlogIndex extends React.Component {
  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')
    const siteDescription = get(
      this,
      'props.data.site.siteMetadata.description'
    )
    const episodes = this.props.data.allStrapiEpisodes.edges
    console.log(episodes)
    const strapiUrl = url => 'http://localhost:1337' + url

    return (
      <Layout location={this.props.location}>
        <Helmet
          htmlAttributes={{ lang: 'en' }}
          meta={[{ name: 'description', content: siteDescription }]}
          title={siteTitle}
          link={[
            { rel: 'stylesheet', href: 'https://cdn.plyr.io/3.3.21/plyr.css' },
            {
              rel: 'stylesheet',
              href: 'https://use.fontawesome.com/releases/v5.5.0/css/all.css',
              integrity:
                'sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU',
              crossorigin: 'anonymous',
            },
          ]}
        />
        {episodes.map(({ node }, index) => {
          const title = get(node, 'title') || node.id
          return (
            <div key={node.id}>
              <h3
                style={{
                  marginBottom: rhythm(1 / 4),
                }}
              >
                <Link style={{ boxShadow: 'none' }} to={node.id}>
                  {title}
                </Link>
              </h3>
              <small>{node.createdAt}</small>
              <p dangerouslySetInnerHTML={{ __html: node.description }} />
              <AudioPlayer
                src={strapiUrl(node.audio.url)}
                title={node.title}
                description={node.description}
                cover={strapiUrl(node.cover.url)}
              />
            </div>
          )
        })}
      </Layout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        description
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "DD MMMM, YYYY")
            title
          }
        }
      }
    }
    allStrapiEpisodes {
      edges {
        node {
          id
          title
          description
          audio {
            id
            url
          }
          cover {
            id
            url
          }
        }
      }
    }
  }
`
