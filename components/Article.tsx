import React from 'react';
import Link from 'next/link';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

import { H1, H2, H3, H4, H5, H6 } from 'components/article-body/Header';
import Tag from 'components/Tag';
import Anchor from 'components/article-body/Anchor';
import UL from 'components/article-body/UL';
import OL from 'components/article-body/OL';
import LI from 'components/article-body/LI';
import Code from 'components/article-body/Code';
import Table from 'components/article-body/Table';
import Blockquote from 'components/article-body/Blockquote';
import Paragraph from 'components/article-body/Paragraph';
import Typography from 'components/UI/Typography';
import Image from 'components/article-body/Image';

import formatDate from 'lib/utils/formatDate';

import { CustomBlok } from 'types';

interface ArticleProps {
  title: string;
  date: string;
  image: string;
  markdown: string;
  tag_list: string[];
  summary?: string;
  authors: CustomBlok[];
}

export default function Article(props: ArticleProps) {
  const { title, date, image, markdown, tag_list, authors = [] } = props;

  return (
    <Box className="space-y-4 mx-auto">
      <Box className="text-center space-y-2">
        <Typography variant="h6" className="text-center text-stieglitz font-semibold">
          {formatDate(date)}
        </Typography>
        <hr className="border-gray-300 dark:border-gray-700"></hr>
        <Typography variant="h1">{title}</Typography>
        {tag_list.map((tag, index) => (
          <Tag key={index} text={tag} />
        ))}
        <Box className={`flex space-x-3 justify-center ${authors.length > 0 ? 'h-[1.8rem]' : ''}`}>
          {authors.constructor === Array
            ? authors?.map((auth: any, index: number) => {
                return (
                  <Tooltip key={index} title={auth.Image.name || auth.Image.title} arrow={true}>
                    <img
                      src={auth.Image.filename}
                      alt={auth.Image.name ?? 'undefined'}
                      className={`rounded-full w-[1.8rem] h-[1.8rem]`}
                    />
                  </Tooltip>
                );
              })
            : null}
        </Box>
      </Box>
      <img src={image} className="mx-auto my-4 rounded-md" alt="cover" />
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: H1,
          h2: H2,
          h3: H3,
          h4: H4,
          h5: H5,
          h6: H6,
          ul: UL,
          ol: OL,
          li: LI,
          code: Code,
          blockquote: Blockquote,
          table: Table,
          a: Anchor,
          p: Paragraph,
          img: Image,
        }}
      >
        {markdown}
      </ReactMarkdown>
      <hr className="border-gray-300 dark:border-gray-700 py-2" />
      <Link href={'/articles'} passHref legacyBehavior>
        <a className="self-center xs:text-md lg:text-lg text-primary dark:text-wave-blue cursor-pointer">
          &larr; Back to Blog
        </a>
      </Link>
    </Box>
  );
}
