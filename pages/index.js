import { useState, useCallback } from 'react'
import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import InfiniteScroll from 'react-infinite-scroll-component'
import delay from 'lodash/delay'

import Tag from '@/components/Tag'

import siteMetadata from '@/data/siteMetadata'

import formatDate from '@/lib/utils/formatDate'
import trimmedSummary from '@/lib/utils/trimmedSummary'
import Storyblok from '@/lib/utils/storyblok-service'

export async function getStaticProps(context) {
  let params = {
    version: 'draft',
  }

  if (context.preview) {
    params.version = 'draft'
    params.cv = Date.now()
  }

  let { data } = await Storyblok.get(`cdn/stories/`, {
    page: 1,
    starts_with: 'articles/',
  })

  const sortedStories = data?.stories
    .map((frontMatter) => frontMatter)
    .sort((item1, item2) => new Date(item2.first_published_at) - new Date(item1.first_published_at))

  return {
    props: {
      stories: data ? sortedStories : false,
      preview: context.preview || false,
      data,
    },
    revalidate: 60,
  }
}

export default function Home({ stories }) {
  let displayedStories = stories.slice(0, displayed).map((frontMatter) => frontMatter)

  const all_tags = [...new Set(stories.map((frontMatter) => frontMatter.tag_list).flat())]

  const [displayed, setDisplayed] = useState(5)

  const handleDisplayed = useCallback(() => {
    delay(() => setDisplayed(displayed + 5), 1000)
  }, [displayed])

  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="pt-6 pb-8 space-y-2 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Latest
          </h1>
          <p className="text-lg leading-7 text-stieglitz dark:text-gray-400">
            {siteMetadata.description}
          </p>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {!stories.length && 'No posts found.'}
          <InfiniteScroll
            dataLength={displayed}
            hasMore={stories.length > displayed}
            loader={<h4 className="text-center">Loading...</h4>}
            next={handleDisplayed}
            endMessage={<p className="text-center">Yay! You have seen it all 🎊</p>}
            scrollThreshold={1.01}
          >
            <div className="flex sm:flex-row sm:justify-center flex-col text-center mt-6">
              {all_tags.map((tag, index) => {
                return <Tag key={index} text={tag} />
              })}
            </div>
            {displayedStories.map((frontMatter, index) => {
              const { title, summary, image } = frontMatter.content
              const { full_slug, /*tag_list,*/ first_published_at } = frontMatter
              return (
                <li key={index} className="py-6">
                  <article>
                    <div className="space-y-2 xl:grid xl:grid-cols-6 gap-3 xl:space-y-0">
                      <Link href={`/${full_slug}`} className={'col-span-2 xl:mr-5'}>
                        <img src={image} className="sm:w-full rounded-md" alt={title} />
                      </Link>
                      <div className="space-y-5 xl:col-span-4">
                        <div className="space-y-1">
                          <div>
                            <h2 className="text-2xl font-bold">
                              <Link
                                href={`/${full_slug}`}
                                className="text-gray-900 dark:text-gray-100"
                              >
                                {title}
                              </Link>
                            </h2>
                            <dl>
                              <dt className="sr-only">Published on</dt>
                              <dd className="text-base font-medium leading-6 text-stieglitz dark:text-gray-400">
                                <time dateTime={first_published_at}>
                                  {formatDate(first_published_at)}
                                </time>
                              </dd>
                            </dl>
                          </div>
                          <div className="prose text-stieglitz max-w-none dark:text-gray-400">
                            {trimmedSummary(summary)}
                          </div>
                          <div className="text-base font-medium leading-6 place-self-end">
                            <Link
                              href={`/${full_slug}`}
                              className="text-primary dark:text-wave-blue dark:hover:text-blue-300"
                              aria-label={`Read "${title}"`}
                            >
                              Read more &rarr;
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </li>
              )
            })}
          </InfiniteScroll>
        </ul>
      </div>
    </>
  )
}
