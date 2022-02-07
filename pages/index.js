import { useState, useCallback, useContext } from 'react'
import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import InfiniteScroll from 'react-infinite-scroll-component'
import delay from 'lodash/delay'

import Tag from '@/components/Tag'

import siteMetadata from '@/data/siteMetadata'

import formatDate from '@/lib/utils/formatDate'
import trimmedSummary from '@/lib/utils/trimmedSummary'
import Storyblok from '@/lib/utils/storyblok-service'

import { LANGUAGE_MAPPING } from 'constants/index'

import { LocalizationContext } from 'contexts/Localization'

export async function getStaticProps(context) {
  let data = await Storyblok.get(`cdn/stories/`, {
    starts_with: 'articles/',
  })

  let zh_data = await Storyblok.get(`cdn/stories/`, {
    starts_with: 'zh/articles/',
  })

  const sortedStories = data.data?.stories
    .map((frontMatter) => frontMatter)
    .sort((item1, item2) => new Date(item2.first_published_at) - new Date(item1.first_published_at))

  const sortedStoriesZh = zh_data.data?.stories
    .map((frontMatter) => frontMatter)
    .sort((item1, item2) => new Date(item2.first_published_at) - new Date(item1.first_published_at))

  return {
    props: {
      stories: {
        en: data.data ? sortedStories : false,
        zh: zh_data.data ? sortedStoriesZh : false,
      },
      preview: context.preview || false,
      data: {
        en: data.data,
        zh: zh_data.data,
      },
    },
    revalidate: 60,
  }
}

export default function Home({ stories }) {
  const [displayed, setDisplayed] = useState(5)
  const { selectedLanguage, setSelectedLanguage } = useContext(LocalizationContext)

  const all_tags = [
    ...new Set(stories[selectedLanguage].map((frontMatter) => frontMatter.tag_list).flat()),
  ]
  let displayedStories = stories[selectedLanguage]
    ?.slice(0, displayed)
    .map((frontMatter) => frontMatter)

  const handleDisplayed = useCallback(() => {
    delay(() => setDisplayed(displayed + 5), 1000)
  }, [displayed])

  const handleSelectLanguage = useCallback(
    (e) => setSelectedLanguage(e.target.value),
    [setSelectedLanguage]
  )

  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="pt-6 pb-8 space-y-2 md:space-y-5">
          <div className="flex justify-between">
            <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
              Latest
            </h1>
            <select
              name="language-selector"
              id="lang-select"
              onChange={handleSelectLanguage}
              className="h-1/2 my-auto rounded-xl dark:text-white dark:bg-cod-gray dark:border-umbra border-primary"
            >
              {Object.keys(LANGUAGE_MAPPING).map((key, index) => {
                return (
                  <option value={LANGUAGE_MAPPING.key} key={index}>
                    {key}
                  </option>
                )
              })}
            </select>
          </div>
          <p className="text-lg leading-7 text-stieglitz dark:text-gray-400">
            {siteMetadata.description}
          </p>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {!stories[selectedLanguage].length && 'No posts found.'}
          <InfiniteScroll
            dataLength={displayed}
            hasMore={stories[selectedLanguage].length > displayed}
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
            {displayedStories?.map((frontMatter, index) => {
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
