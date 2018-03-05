import Head from 'next/head';
export default () => {
	return (
		<Head>
			<title>GIFPoly | search for GIFs with your language</title>
			<meta
				name="viewport"
				content="initial-scale=1.0, width=device-width"
			/>
			<meta charSet="utf-8" />
			{/* <!-- Search Engine --> */}
			<meta
				name="description"
				content="Search for GIFs with your own language"
			/>
			<meta name="image" content="https://gifpoly.now.sh/static/screenshot.png" />
			{/* <!-- Schema.org for Google --> */}
			<meta itemProp="name" content="gifpoly.com" />
			<meta
				itemProp="description"
				content="Search for GIFs with your own language"
			/>
			<meta itemProp="image" content="https://gifpoly.now.sh/static/screenshot.png" />
			{/* <!-- Twitter --> */}
			<meta
				name="twitter:card"
				content="summary"
			/>
			<meta name="twitter:title" content="GIFPoly" />
			<meta
				name="twitter:description"
				content="Search for GIFs with your own language"
			/>
			<meta name="twitter:site" content="iamtekeste" />
			<meta name="twitter:image:src" content="https://gifpoly.now.sh/static/screenshot.png" />
			{/* <!-- Open Graph general (Facebook, Pinterest & Google+) --> */}
			<meta name="og:title" content="gifpoly.com" />
			<meta
				name="og:description"
				content="Search for GIFs with your own language"
			/>
			<meta name="og:image" content="https://gifpoly.now.sh/static/screenshot.png" />
			<meta name="og:url" content="gifpoly.com" />
			<meta name="og:site_name" content="GIFPoly" />
			<meta name="fb:admins" content="1507121833" />
			<meta name="og:type" content="website" />
			<link rel="stylesheet" href="/static/app.css" />
			<script
			  dangerouslySetInnerHTML={{__html: `  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
			})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

			ga('create', 'UA-101927033-4', 'auto');
			ga('send', 'pageview');`}}
			/>
	</Head>
);
};
