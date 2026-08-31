const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

const parents = {
  content: {
    title: 'Content Creation',
    slug: 'content-creation',
    image: 'https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?w=2200&q=86&auto=format&fit=crop',
    card: 'We turn ideas into impactful visual stories that inspire action.',
    filters: ['All', 'Photo', 'Video', 'Social Content', 'Brand Stories', 'Campaigns'],
    process: [
      ['Discover', 'We learn your brand, audience, and the story your content needs to carry.'],
      ['Strategize', 'We shape the concept, visual direction, and production plan.'],
      ['Create', 'We produce polished content with clear creative direction.'],
      ['Deliver', 'We refine, optimize, and deliver assets ready for every platform.']
    ],
    tools: ['IG', 'CAM', 'Pr', 'MIC']
  },
  social: {
    title: 'Social Media Management',
    slug: 'social-media-management',
    image: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=2200&q=86&auto=format&fit=crop',
    card: 'We build social systems that keep your brand visible, consistent, and easy to engage with.',
    filters: ['All', 'Instagram', 'Planning', 'Copy', 'Community', 'Analytics'],
    process: [
      ['Audit', 'We review your current presence, audience, and opportunities.'],
      ['Plan', 'We build a practical content rhythm and campaign direction.'],
      ['Manage', 'We schedule, publish, write, and keep the presence active.'],
      ['Optimize', 'We track performance and refine what works best.']
    ],
    tools: ['IG', 'Meta', 'Canva', 'Data']
  },
  digital: {
    title: 'Digital Marketing',
    slug: 'digital-marketing',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=2200&q=86&auto=format&fit=crop',
    card: 'We connect creative content with strategy so campaigns move with purpose.',
    filters: ['All', 'Social Ads', 'Campaigns', 'Creative', 'Local Ads', 'Awareness'],
    process: [
      ['Research', 'We study your audience, offer, market, and campaign goal.'],
      ['Build', 'We create the campaign structure, content, and message.'],
      ['Launch', 'We activate the campaign with clean assets and tracking.'],
      ['Optimize', 'We improve direction through reporting and performance insight.']
    ],
    tools: ['Ads', 'IG', 'SEO', 'Data']
  },
  event: {
    title: 'Event & Brand Media',
    slug: 'event-brand-media',
    image: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=2200&q=86&auto=format&fit=crop',
    card: 'We capture the moments, people, and energy that make your event worth remembering.',
    filters: ['All', 'Event', 'Photo', 'Video', 'Interviews', 'Recap'],
    process: [
      ['Plan', 'We map the event flow, must-capture moments, and delivery goals.'],
      ['Capture', 'We film and photograph with a calm, professional on-site presence.'],
      ['Edit', 'We shape the strongest moments into polished media assets.'],
      ['Deliver', 'We provide ready-to-share files for promotion and memory.']
    ],
    tools: ['CAM', 'MIC', 'Pr', 'Light']
  }
};

const pool = {
  video: [
    'https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?w=1200&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=80&auto=format&fit=crop'
  ],
  photo: [
    'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1200&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=1200&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=80&auto=format&fit=crop'
  ],
  strategy: [
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80&auto=format&fit=crop'
  ],
  social: [
    'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=1200&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=1200&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=1200&q=80&auto=format&fit=crop'
  ],
  product: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1200&q=80&auto=format&fit=crop'
  ],
  event: [
    'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=1200&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80&auto=format&fit=crop'
  ],
  podcast: [
    'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=1200&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=1200&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1200&q=80&auto=format&fit=crop'
  ]
};

const services = [
  ['content', 'brand-reels-short-form-video', 'Brand Reels & Short-Form Video', 'Scroll-stopping reels that turn your brand, products and ideas into content people remember.', 'We create brand reels, Instagram reels, vertical videos, product reels, service reels, promotional reels, lifestyle reels, and social content edits built for attention.', ['Creative Concepts', 'Vertical Production', 'Fast-Paced Editing', 'Platform Optimization'], ['Brand Reels', 'Instagram Reels', 'Short-Form Video', 'Vertical Video', 'Product Reels', 'Service Reels', 'Promotional Reels', 'Social Content Editing'], 'social'],
  ['content', 'professional-photography', 'Professional Photography', 'Premium photography that makes your brand feel clear, credible, and memorable.', 'We capture refined brand visuals with direction, detail, and polish.', ['Creative Direction', 'Shoot Planning', 'Professional Capture', 'Editing & Retouching'], ['Product Photography', 'Lifestyle Photography', 'Portraits', 'Restaurant Photography', 'Event Photography', 'Brand Shoots', 'Commercial Photography', 'Social Media Photography'], 'photo'],
  ['content', 'product-photography', 'Product Photography', 'Professional product imagery designed to showcase details, quality and brand identity.', 'We create commercial product shoots, e-commerce images, lifestyle product photography, detail shots, campaign photography, and social-ready product content.', ['Creative Direction', 'Shoot Planning', 'Professional Capture', 'Editing & Retouching'], ['Commercial Product Shoots', 'E-commerce Product Images', 'Lifestyle Product Photography', 'Detail Shots', 'Campaign Photography', 'Social Media Product Content', 'Beauty Product Photography', 'Close-Up Commercial Photography'], 'product'],
  ['content', 'video-production', 'Video Production', 'Cinematic video production for brand stories, promos, events, and campaigns.', 'We produce polished video assets that bring your message to life.', ['Creative Treatment', 'Production Planning', 'Cinematic Filming', 'Edit & Delivery'], ['Brand Films', 'Product Videos', 'Interview Production', 'Promotional Films', 'Event Films', 'Social Video', 'Behind The Scenes', 'Lifestyle Video'], 'video'],
  ['content', 'product-video-production', 'Product Video Production', 'Creative product videos that highlight features, tell your brand story and drive attention.', 'We produce product demonstration videos, commercial product films, product reels, feature highlight videos, lifestyle product films, launch videos, and social product videos.', ['Concept', 'Production', 'Product Storytelling', 'Editing & Delivery'], ['Product Demonstration Videos', 'Commercial Product Films', 'Product Reels', 'Feature Highlight Videos', 'Lifestyle Product Films', 'Launch Videos', 'Social Product Videos', 'Product Lighting Setups'], 'product'],
  ['content', 'creative-content-concepts', 'Creative Content Concepts', 'Original content ideas shaped around your audience, offer, and brand personality.', 'We turn rough ideas into strong creative directions your audience can feel.', ['Idea Mapping', 'Visual Direction', 'Campaign Angles', 'Content Storylines'], ['Concept Boards', 'Campaign Ideas', 'Creative Prompts', 'Brand Themes', 'Visual Directions', 'Story Angles', 'Launch Concepts', 'Series Ideas'], 'strategy'],
  ['content', 'social-media-content-ideas', 'Social Media Content Ideas', 'Fresh, practical ideas for posts, reels, stories, and campaigns.', 'We create content prompts and formats that make posting feel intentional.', ['Content Pillars', 'Post Concepts', 'Reel Ideas', 'Engagement Prompts'], ['Reel Concepts', 'Carousel Ideas', 'Story Prompts', 'Educational Posts', 'Engagement Posts', 'Product Ideas', 'Brand Moments', 'Monthly Themes'], 'social'],
  ['content', 'promotional-videos', 'Promotional Videos', 'Focused promotional videos that make your offer easy to understand and act on.', 'We create high-impact promotional content for launches, events, and campaigns.', ['Message Strategy', 'Script Direction', 'Video Production', 'Conversion Editing'], ['Launch Videos', 'Offer Promos', 'Service Videos', 'Social Ads', 'Event Promos', 'Product Spots', 'Campaign Clips', 'Brand Teasers'], 'video'],
  ['content', 'brand-storytelling', 'Brand Storytelling', 'Narrative-led content that helps people understand who you are and why you matter.', 'We craft stories that make your brand feel human, confident, and memorable.', ['Story Discovery', 'Narrative Direction', 'Visual Storytelling', 'Emotional Editing'], ['Founder Stories', 'Brand Films', 'Mission Videos', 'Customer Moments', 'Team Stories', 'Origin Stories', 'Campaign Narratives', 'Lifestyle Stories'], 'strategy'],
  ['content', 'product-service-content', 'Product & Service Content', 'Clear product and service visuals that help people see the value quickly.', 'We make your offer look polished, useful, and ready to buy.', ['Offer Positioning', 'Shot Lists', 'Product Capture', 'Benefit-Led Edits'], ['Product Shoots', 'Service Demos', 'Detail Shots', 'Process Clips', 'Launch Assets', 'Commercial Images', 'Offer Explainers', 'Social Product Content'], 'product'],
  ['content', 'lifestyle-event-content', 'Lifestyle & Event Content', 'Natural lifestyle and event content that gives your brand a lived-in presence.', 'We capture real moments with a polished editorial eye.', ['Mood Direction', 'Live Capture', 'Lifestyle Framing', 'Social Delivery'], ['Lifestyle Shoots', 'Event Moments', 'Creator Scenes', 'Brand Activations', 'Social Recaps', 'Candid Stories', 'Behind The Scenes', 'Community Content'], 'event'],
  ['content', 'podcast-production', 'Podcast Production', 'Professional podcast content that turns meaningful conversations into stories worth sharing.', 'We produce podcast recordings, video podcasts, interview podcasts, multi-camera podcast production, audio editing, video editing, short social clips, podcast reels, and distribution-ready content.', ['Setup', 'Record', 'Edit', 'Repurpose'], ['Podcast Recording', 'Video Podcasts', 'Interview Podcasts', 'Multi-Camera Podcast Production', 'Audio Editing', 'Video Editing', 'Short Social Clips', 'Podcast Reels'], 'podcast'],

  ['social', 'instagram-management', 'Instagram Management', 'A polished Instagram presence managed with strategy, consistency, and care.', 'We keep your Instagram active, intentional, and aligned with your brand.', ['Profile Direction', 'Content Rhythm', 'Publishing Support', 'Engagement Review'], ['Feed Planning', 'Reels Calendar', 'Story Direction', 'Profile Polish', 'Caption Flow', 'Community Touchpoints', 'Content Review', 'Monthly Insights'], 'social'],
  ['social', 'content-planning', 'Content Planning', 'A clear content roadmap so your brand always knows what to say next.', 'We plan content with purpose before the production begins.', ['Content Pillars', 'Monthly Themes', 'Campaign Mapping', 'Posting Rhythm'], ['Monthly Plans', 'Campaign Calendars', 'Content Pillars', 'Reel Themes', 'Story Ideas', 'Launch Planning', 'Seasonal Content', 'Creative Roadmaps'], 'strategy'],
  ['social', 'monthly-content-calendars', 'Monthly Content Calendars', 'Organized monthly calendars that make content feel simple and consistent.', 'We map posts, reels, captions, and campaign beats into one clear schedule.', ['Monthly Planning', 'Post Mapping', 'Caption Direction', 'Delivery Schedule'], ['Calendar Layouts', 'Weekly Themes', 'Reel Schedules', 'Story Plans', 'Launch Dates', 'Content Batches', 'Posting Plans', 'Campaign Timelines'], 'strategy'],
  ['social', 'post-reel-scheduling', 'Post & Reel Scheduling', 'Reliable scheduling support so your content goes live with the right timing.', 'We organize publishing so your brand stays present without daily pressure.', ['Scheduling Setup', 'Asset Organization', 'Publish Timing', 'Platform Checks'], ['Scheduled Posts', 'Reel Publishing', 'Story Timing', 'Campaign Posts', 'Content Queue', 'Platform Prep', 'Posting Windows', 'Asset Tracking'], 'social'],
  ['social', 'caption-copywriting', 'Caption & Copywriting', 'Captions and social copy written with clarity, voice, and purpose.', 'We write words that sound like your brand and guide people toward action.', ['Brand Voice', 'Caption Writing', 'Hook Creation', 'CTA Direction'], ['Caption Sets', 'Post Hooks', 'Story Copy', 'Launch Copy', 'CTA Lines', 'Educational Captions', 'Brand Voice Notes', 'Campaign Messaging'], 'strategy'],
  ['social', 'community-management', 'Community Management', 'Thoughtful community support that helps your audience feel seen and answered.', 'We help manage the everyday interactions that build brand trust.', ['Inbox Review', 'Comment Support', 'Engagement Prompts', 'Tone Guidance'], ['Comment Care', 'Message Support', 'Engagement Checks', 'Audience Questions', 'Community Moments', 'Response Direction', 'Social Listening', 'Trust Building'], 'social'],
  ['social', 'audience-engagement', 'Audience Engagement', 'Social engagement designed to strengthen connection and encourage conversation.', 'We create ways for your audience to respond, share, and stay involved.', ['Engagement Strategy', 'Interactive Stories', 'Community Prompts', 'Response Review'], ['Poll Ideas', 'Story Questions', 'Comment Prompts', 'Audience Research', 'Engagement Posts', 'Conversation Starters', 'Community Stories', 'Response Loops'], 'social'],
  ['social', 'social-media-strategy', 'Social Media Strategy', 'A focused social strategy built around audience, goals, and measurable direction.', 'We create the plan behind the content so every post has a reason.', ['Brand Audit', 'Audience Planning', 'Content Direction', 'Performance Review'], ['Brand Audits', 'Platform Strategy', 'Content Pillars', 'Audience Maps', 'Campaign Direction', 'Growth Plans', 'Competitive Review', 'Performance Notes'], 'strategy'],
  ['social', 'social-media-campaigns', 'Social Media Campaigns', 'Strategic content campaigns designed to build attention, engagement and brand presence.', 'We execute campaign content, reel campaigns, brand launch campaigns, promotional campaigns, seasonal campaigns, audience engagement, scheduling, and performance tracking.', ['Plan', 'Create', 'Launch', 'Optimize'], ['Campaign Planning', 'Campaign Content', 'Reel Campaigns', 'Brand Launch Campaigns', 'Promotional Campaigns', 'Seasonal Campaigns', 'Audience Engagement', 'Campaign Scheduling'], 'social'],
  ['social', 'performance-reach-tracking', 'Performance & Reach Tracking', 'Clear performance tracking that shows what content is working and why.', 'We translate social metrics into practical creative decisions.', ['Reach Review', 'Content Insights', 'Trend Checks', 'Optimization Notes'], ['Reach Reports', 'Engagement Trends', 'Top Posts', 'Audience Growth', 'Story Metrics', 'Reel Performance', 'Insight Reviews', 'Next Steps'], 'strategy'],
  ['social', 'monthly-analytics-reporting', 'Monthly Analytics & Reporting', 'Premium monthly reporting that turns numbers into next-step strategy.', 'We package your performance data into clear, useful reporting.', ['Data Review', 'Report Design', 'Insight Summary', 'Action Planning'], ['Monthly Reports', 'KPI Snapshots', 'Audience Insights', 'Campaign Results', 'Content Winners', 'Growth Tracking', 'Reach Analysis', 'Strategy Notes'], 'strategy'],

  ['digital', 'brand-business-strategy', 'Brand & Business Strategy', 'Creative strategies that strengthen your presence, sharpen your message and drive growth.', 'We shape brand positioning, messaging strategy, audience direction, campaign direction, content strategy, growth planning, market presence, and promotional planning.', ['Discover', 'Position', 'Plan', 'Grow'], ['Brand Positioning', 'Messaging Strategy', 'Audience Direction', 'Campaign Direction', 'Content Strategy', 'Growth Planning', 'Market Presence', 'Promotional Planning'], 'strategy'],
  ['digital', 'business-promotion-brand-visibility', 'Business Promotion & Brand Visibility', 'Purpose-driven content that puts your business in front of the right audience.', 'We build business promotions, local campaigns, promotional content, brand awareness, social promotions, launch promotions, offer campaigns, and service promotions.', ['Understand', 'Position', 'Promote', 'Amplify'], ['Business Promotions', 'Local Business Campaigns', 'Promotional Content', 'Brand Awareness', 'Social Promotions', 'Launch Promotions', 'Offer Campaigns', 'Service Promotions'], 'event'],
  ['digital', 'brand-campaigns', 'Brand Campaigns', 'Campaigns that bring your message, visuals, and audience strategy together.', 'We build campaigns that make your brand feel coordinated and memorable.', ['Campaign Strategy', 'Creative Direction', 'Asset Planning', 'Launch Support'], ['Brand Launches', 'Campaign Concepts', 'Creative Assets', 'Audience Messaging', 'Social Campaigns', 'Offer Campaigns', 'Awareness Pushes', 'Content Rollouts'], 'strategy'],
  ['digital', 'influencer-marketing', 'Influencer Marketing', 'Creator partnerships planned to feel authentic, aligned, and effective.', 'We help brands work with influencers in a way that feels natural and useful.', ['Creator Fit', 'Campaign Briefs', 'Content Direction', 'Performance Review'], ['Creator Campaigns', 'Influencer Briefs', 'Lifestyle Posts', 'Product Features', 'Collab Reels', 'Brand Mentions', 'Campaign Tracking', 'Social Proof'], 'social'],
  ['digital', 'creator-collaborations', 'Creator Collaborations', 'Collaborative content that connects your brand with the right creator voices.', 'We shape creator collaborations that look polished without feeling forced.', ['Collab Planning', 'Creative Briefs', 'Shot Direction', 'Content Review'], ['Creator Shoots', 'Collab Reels', 'Brand Features', 'Lifestyle Clips', 'UGC Direction', 'Partner Posts', 'Campaign Assets', 'Social Stories'], 'social'],
  ['digital', 'digital-advertising', 'Digital Advertising', 'Digital ads built with strong creative, clear targeting, and useful reporting.', 'We create ad campaigns designed to reach the right people with the right message.', ['Audience Research', 'Ad Creative', 'Campaign Setup', 'Optimization'], ['Social Ads', 'Creative Testing', 'Awareness Ads', 'Local Ads', 'Lead Campaigns', 'Offer Ads', 'Retargeting Creative', 'Ad Reports'], 'strategy'],
  ['digital', 'sponsored-content', 'Sponsored Content', 'Authentic branded content that connects products and partnerships with the right audience.', 'We create brand partnerships, sponsored reels, creator collaborations, sponsored videos, product integrations, campaign content, event sponsor content, and social partnership content.', ['Partnership Brief', 'Creative Concept', 'Production', 'Distribution'], ['Brand Partnerships', 'Sponsored Reels', 'Creator Collaborations', 'Sponsored Videos', 'Product Integrations', 'Campaign Content', 'Event Sponsor Content', 'Social Partnership Content'], 'product'],
  ['digital', 'promotional-campaigns', 'Promotional Campaigns', 'Focused promotions that make launches, offers, and events stand out.', 'We plan promotional moments with clear messaging and attractive visuals.', ['Offer Strategy', 'Promo Assets', 'Campaign Timing', 'Launch Review'], ['Offer Launches', 'Promo Videos', 'Social Pushes', 'Email Graphics', 'Event Promos', 'Countdown Assets', 'Launch Reels', 'Campaign Recaps'], 'product'],
  ['digital', 'social-media-campaign-strategy', 'Social Media Campaign Strategy', 'Campaign strategy that turns social content into a coordinated push.', 'We map messaging, timing, and content so campaigns feel connected.', ['Campaign Goals', 'Content Mapping', 'Platform Strategy', 'Performance Review'], ['Campaign Maps', 'Content Timelines', 'Ad Concepts', 'Launch Posts', 'Story Sequences', 'Audience Angles', 'Creative Testing', 'Result Reviews'], 'strategy'],
  ['digital', 'brand-awareness-campaigns', 'Brand Awareness Campaigns', 'Awareness campaigns that help more of the right people recognize your brand.', 'We create visibility campaigns with memorable visuals and clear positioning.', ['Audience Positioning', 'Awareness Creative', 'Channel Planning', 'Reach Review'], ['Awareness Videos', 'Brand Graphics', 'Social Ads', 'Lifestyle Creative', 'Reach Campaigns', 'Founder Features', 'Community Content', 'Campaign Reports'], 'social'],
  ['digital', 'local-business-marketing', 'Local Business Marketing', 'Marketing support for local brands that need visibility, trust, and repeat attention.', 'We help local businesses show up consistently and look professional online.', ['Local Positioning', 'Offer Messaging', 'Content Planning', 'Promotion Support'], ['Local Campaigns', 'Restaurant Content', 'Service Promotions', 'Community Posts', 'Google Assets', 'Social Ads', 'Offer Reels', 'Monthly Promotions'], 'event'],
  ['digital', 'campaign-content-creation', 'Campaign Content Creation', 'Campaign-ready content packages created around one clear marketing goal.', 'We produce the assets a campaign needs to feel complete from launch to follow-up.', ['Campaign Concept', 'Asset Production', 'Content Variations', 'Delivery Prep'], ['Campaign Videos', 'Social Graphics', 'Promo Photos', 'Ad Creative', 'Story Sets', 'Launch Assets', 'Recap Content', 'Retargeting Assets'], 'video'],

  ['event', 'event-coverage', 'Event Coverage', 'Capturing your event’s energy and key moments through engaging video content.', 'We cover event videography, event photography, event reels, live social content, guest interviews, sponsor content, behind-the-scenes coverage, highlight videos, and post-event content.', ['Plan', 'Capture', 'Edit', 'Deliver'], ['Event Videography', 'Event Photography', 'Event Reels', 'Live Social Content', 'Guest Interviews', 'Sponsor Content', 'Behind-the-Scenes Coverage', 'Highlight Videos'], 'event'],
  ['event', 'event-photography', 'Event Photography', 'Polished event photography that preserves the energy and important details.', 'We capture the people, moments, and setting that make your event feel alive.', ['Shot Planning', 'Guest Capture', 'Detail Photography', 'Edited Gallery'], ['Guest Photos', 'Stage Moments', 'Venue Details', 'Sponsor Photos', 'Candid Coverage', 'Group Photos', 'Brand Activations', 'Social Edits'], 'photo'],
  ['event', 'event-videography', 'Event Videography', 'Professional event video that turns live moments into lasting promotional assets.', 'We film events with cinematic movement, clean audio, and strong story flow.', ['Run-Of-Show Planning', 'Live Filming', 'Audio Capture', 'Recap Editing'], ['Event Films', 'Highlight Reels', 'Speaker Clips', 'Sponsor Videos', 'Crowd Energy', 'Behind The Scenes', 'Social Cuts', 'Recap Videos'], 'video'],
  ['event', 'sponsor-videos', 'Sponsor Videos', 'Sponsor-focused videos that showcase value, visibility, and partnership moments.', 'We create sponsor content that feels polished, appreciative, and useful after the event.', ['Sponsor Goals', 'Brand Capture', 'Interview Clips', 'Delivery Formats'], ['Sponsor Recaps', 'Brand Booths', 'Partner Interviews', 'Activation Clips', 'Logo Moments', 'Event Mentions', 'Social Sponsor Cuts', 'Thank You Videos'], 'event'],
  ['event', 'promotional-videos', 'Promotional Videos', 'Event promotional videos built to increase attention before and after the moment.', 'We make your event look exciting, clear, and worth showing up for.', ['Promo Direction', 'Event Messaging', 'Video Capture', 'Social Cuts'], ['Event Teasers', 'Ticket Promos', 'Recap Videos', 'Social Trailers', 'Speaker Promos', 'Venue Videos', 'Sponsor Clips', 'Launch Announcements'], 'video'],
  ['event', 'artist-guest-interviews', 'Artist & Guest Interviews', 'Interview content that gives your event personality, voice, and human connection.', 'We capture thoughtful conversations with guests, artists, speakers, and partners.', ['Question Planning', 'Interview Setup', 'Clean Audio', 'Clip Editing'], ['Artist Interviews', 'Guest Stories', 'Speaker Clips', 'Partner Q&A', 'Red Carpet Moments', 'Social Quotes', 'Podcast Clips', 'Event Testimonials'], 'podcast'],
  ['event', 'event-reels', 'Event Reels', 'Short-form event reels that keep the energy moving after the event ends.', 'We create fast, social-first edits that turn event moments into shareable content.', ['Moment Capture', 'Vertical Editing', 'Music Pacing', 'Platform Delivery'], ['Highlight Reels', 'Crowd Reels', 'Speaker Reels', 'Sponsor Reels', 'Behind The Scenes', 'Venue Reels', 'Guest Moments', 'Aftermovie Shorts'], 'social'],
  ['event', 'behind-the-scenes-content', 'Behind-the-Scenes Content', 'Behind-the-scenes media that shows the work, people, and energy behind the brand.', 'We capture candid process moments that make your event or campaign feel real.', ['Access Planning', 'Candid Capture', 'Process Story', 'Social Editing'], ['Setup Moments', 'Team Stories', 'Backstage Clips', 'Production Details', 'Creator Moments', 'Prep Reels', 'Process Photos', 'Day-Of Stories'], 'event'],
  ['event', 'event-social-media-coverage', 'Event Social Media Coverage', 'Live and post-event social coverage designed to keep your audience engaged.', 'We create social assets before, during, and after the event experience.', ['Coverage Timeline', 'Story Capture', 'Live Content', 'Recap Assets'], ['Story Coverage', 'Live Updates', 'Event Reels', 'Guest Posts', 'Sponsor Tags', 'Recap Carousels', 'Behind The Scenes', 'Post-Event Posts'], 'social'],
  ['event', 'podcast-interview-content', 'Podcast / Interview Content', 'Podcast and interview content captured with clean audio, strong framing, and clear story.', 'We produce interview media that feels credible, intimate, and ready to share.', ['Interview Planning', 'Audio Setup', 'Camera Framing', 'Clip Packaging'], ['Podcast Episodes', 'Interview Clips', 'Audio Snippets', 'Guest Features', 'Social Quotes', 'Long-Form Edits', 'Teaser Clips', 'Conversation Highlights'], 'podcast'],
  ['event', 'post-event-promotional-content', 'Post-Event Promotional Content', 'Post-event content that extends the value of your event after it ends.', 'We turn captured moments into promotional assets for the next announcement.', ['Asset Review', 'Recap Story', 'Promo Editing', 'Launch Prep'], ['Recap Films', 'Thank You Posts', 'Sponsor Highlights', 'Next Event Teasers', 'Photo Galleries', 'Social Clips', 'Campaign Recaps', 'Promo Assets'], 'event']
];

const related = {
  'brand-reels-short-form-video': ['video-production', 'social-media-content-ideas', 'product-video-production'],
  'product-photography': ['product-service-content', 'professional-photography', 'product-video-production'],
  'product-video-production': ['video-production', 'product-photography', 'promotional-videos'],
  'podcast-production': ['video-production', 'artist-guest-interviews', 'social-media-content-ideas'],
  'social-media-campaigns': ['social-media-strategy', 'content-planning', 'audience-engagement'],
  'brand-business-strategy': ['brand-campaigns', 'social-media-campaign-strategy', 'business-promotion-brand-visibility'],
  'business-promotion-brand-visibility': ['local-business-marketing', 'brand-awareness-campaigns', 'campaign-content-creation'],
  'sponsored-content': ['influencer-marketing', 'creator-collaborations', 'brand-campaigns'],
  'event-coverage': ['event-videography', 'event-photography', 'event-reels']
};

function findService(slug, parentKey) {
  return services.find(service => service[1] === slug && (!parentKey || service[0] === parentKey))
    || services.find(service => service[1] === slug);
}

function serviceHref(service, prefix) {
  return `${prefix}services/${parents[service[0]].slug}/${service[1]}.html`;
}

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function titleLines(title) {
  const parts = title.split(' ');
  if (parts.length === 1) return esc(title);
  if (parts.length === 2) return `${esc(parts[0])}<br><em>${esc(parts[1])}</em>`;
  const first = parts.slice(0, Math.ceil(parts.length / 2)).join(' ');
  const second = parts.slice(Math.ceil(parts.length / 2)).join(' ');
  return `${esc(first)}<br><em>${esc(second)}</em>`;
}

function imageFor(service, index, wide = false) {
  const images = pool[service[7]] || pool.strategy;
  return images[index % images.length].replace('w=1200', wide ? 'w=1600' : 'w=1200');
}

function relatedCards(service, prefix) {
  const fallback = services.filter(item => item[0] === service[0] && item[1] !== service[1]).slice(0, 3);
  const items = (related[service[1]] || fallback.map(item => item[1]))
    .map(slug => findService(slug, service[0]) || findService(slug))
    .filter(Boolean)
    .filter(item => item[1] !== service[1])
    .slice(0, 3);

  return items.map((item, index) => `<a href="${serviceHref(item, prefix)}" class="related-card">
          <img src="${imageFor(item, index + 1, true)}" alt="${esc(item[2])}" loading="lazy" onerror="this.style.display='none'">
          <span class="rc-inner"><span class="rc-cat">${esc(parents[item[0]].title)}</span><span class="rc-title">${esc(item[2])}</span></span>
        </a>`).join('\n        ');
}

function featureCopy(title, feature) {
  const lower = title.toLowerCase();
  if (/analytics|tracking|reporting/.test(lower)) return `Clear ${feature.toLowerCase()} that turns performance into better decisions.`;
  if (/event|sponsor|artist|guest|podcast|interview/.test(lower)) return `${feature} shaped to capture the strongest moments with a premium finish.`;
  if (/social|instagram|caption|community|audience/.test(lower)) return `${feature} designed to keep your brand consistent, active, and easy to engage with.`;
  if (/advertising|campaign|marketing/.test(lower)) return `${feature} built around audience, message, creative direction, and measurable action.`;
  return `${feature} created with taste, clarity, and a clear reason behind every asset.`;
}

function header(prefix) {
  return `<a href="#main" class="skip-link">Skip to content</a>
<header class="site-header" id="siteHeader">
  <div class="wrap header-inner">
    <a href="${prefix}index.html" class="logo-row">
      <img src="${prefix}assets/images/logo-final-header.png" alt="KV Media House logo" class="site-logo logo-mark">
      <span class="logo-text"><span class="kv">KV</span><span class="mh">MEDIA HOUSE</span></span>
    </a>
    <nav class="desktop-nav" aria-label="Primary">
      <ul>
        <li><a href="${prefix}index.html" class="nav-link">Home</a></li>
        <li><a href="${prefix}about.html" class="nav-link">About</a></li>
        <li class="has-mega">
          <a href="${prefix}services.html" class="nav-link active">Services</a>
          <div class="mega">
            <div class="mega-col">
              <h6>01 - Content</h6>
              <a href="../content-creation.html" class="mega-parent">Content Creation</a>
              <a href="../content-creation/brand-reels-short-form-video.html" class="mega-child">Brand Reels & Short-Form Video</a>
              <a href="../content-creation/professional-photography.html" class="mega-child">Professional Photography</a>
              <a href="../content-creation/video-production.html" class="mega-child">Video Production</a>
              <a href="../content-creation/creative-content-concepts.html" class="mega-child">Creative Content Concepts</a>
            </div>
            <div class="mega-col">
              <h6>02 - Social</h6>
              <a href="../social-media-management.html" class="mega-parent">Social Media Management</a>
              <a href="../social-media-management/instagram-management.html" class="mega-child">Instagram Management</a>
              <a href="../social-media-management/content-planning.html" class="mega-child">Content Planning</a>
              <a href="../social-media-management/monthly-content-calendars.html" class="mega-child">Monthly Content Calendars</a>
              <a href="../social-media-management/post-reel-scheduling.html" class="mega-child">Post & Reel Scheduling</a>
            </div>
            <div class="mega-col">
              <h6>03 - Digital</h6>
              <a href="../digital-marketing.html" class="mega-parent">Digital Marketing</a>
              <a href="../digital-marketing/brand-business-strategy.html" class="mega-child">Brand & Business Strategy</a>
              <a href="../digital-marketing/influencer-marketing.html" class="mega-child">Influencer Marketing</a>
              <a href="../digital-marketing/creator-collaborations.html" class="mega-child">Creator Collaborations</a>
              <a href="../digital-marketing/digital-advertising.html" class="mega-child">Digital Advertising</a>
            </div>
            <div class="mega-col">
              <h6>04 - Event</h6>
              <a href="../event-brand-media.html" class="mega-parent">Event & Brand Media</a>
              <a href="../event-brand-media/event-coverage.html" class="mega-child">Event Coverage</a>
              <a href="../event-brand-media/event-photography.html" class="mega-child">Event Photography</a>
              <a href="../event-brand-media/event-videography.html" class="mega-child">Event Videography</a>
              <a href="../event-brand-media/sponsor-videos.html" class="mega-child">Sponsor Videos</a>
            </div>
          </div>
        </li>
        <li><a href="${prefix}work.html" class="nav-link">Work</a></li>
        <li><a href="${prefix}founder.html" class="nav-link">Founder</a></li>
        <li><a href="${prefix}blog.html" class="nav-link">Blog</a></li>
        <li><a href="${prefix}contact.html" class="nav-link">Contact</a></li>
      </ul>
    </nav>
    <div class="header-cta">
      <a href="${prefix}contact.html" class="btn btn-solid"><span>Start a Project</span></a>
      <button class="burger" id="burgerBtn" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>
    </div>
  </div>
</header>
<div class="mobile-menu" id="mobileMenu">
  <div class="mobile-menu-top wrap" style="padding:0;">
    <span class="logo-row"><img src="${prefix}assets/images/logo-final-header.png" alt="KV Media House logo" class="site-logo logo-mark"><span class="logo-text"><span class="kv">KV</span><span class="mh">MEDIA HOUSE</span></span></span>
    <button class="close-btn" id="closeMenuBtn">Close</button>
  </div>
  <nav class="wrap" style="padding:0; overflow-y:auto;">
    <a href="${prefix}index.html">Home</a>
    <a href="${prefix}about.html">About</a>
    <a href="${prefix}services.html">Services</a>
    <div class="sub-links">
      <a href="../content-creation.html">Content Creation</a>
      <a href="../social-media-management.html">Social Media Management</a>
      <a href="../digital-marketing.html">Digital Marketing</a>
      <a href="../event-brand-media.html">Event & Brand Media</a>
    </div>
    <a href="${prefix}work.html">Work</a>
    <a href="${prefix}founder.html">Founder</a>
    <a href="${prefix}blog.html">Blog</a>
    <a href="${prefix}contact.html">Contact</a>
  </nav>
  <div class="mobile-footer wrap" style="padding-left:0;padding-right:0;">
    <a href="tel:6723991436">672-399-1436</a>
    <a href="mailto:krishabenvadariya29@gmail.com">krishabenvadariya29@gmail.com</a>
    <a href="https://www.instagram.com/kv_mediahouse?igsi=bW1xZ282dXFwM2du" target="_blank" rel="noopener">@kv_mediahouse</a>
  </div>
</div>`;
}

function footer(prefix) {
  return `<footer>
  <div class="wrap">
    <div class="footer-top">
      <div class="foot-logo">
        <div class="foot-logo-row"><img src="${prefix}assets/images/logo-final-header.png" alt="KV Media House logo"><div><div class="kv">KV</div><div class="mh">MEDIA HOUSE</div></div></div>
        <p class="foot-statement">We Create. We Connect. We Make Brands Seen.</p>
      </div>
      <div class="foot-col">
        <h5>Navigate</h5>
        <a href="${prefix}index.html">Home</a><a href="${prefix}about.html">About</a><a href="${prefix}services.html">Services</a><a href="${prefix}work.html">Work</a><a href="${prefix}founder.html">Founder</a><a href="${prefix}blog.html">Blog</a><a href="${prefix}contact.html">Contact</a>
      </div>
      <div class="foot-col">
        <h5>Services</h5>
        <a href="../content-creation.html">Content Creation</a><a href="../social-media-management.html">Social Media Management</a><a href="../digital-marketing.html">Digital Marketing</a><a href="../event-brand-media.html">Event & Brand Media</a>
      </div>
      <div class="foot-col">
        <h5>Contact</h5>
        <a href="tel:6723991436">672-399-1436</a>
        <a href="mailto:krishabenvadariya29@gmail.com">krishabenvadariya29@gmail.com</a>
        <a href="https://www.instagram.com/kv_mediahouse?igsi=bW1xZ282dXFwM2du" target="_blank" rel="noopener">@kv_mediahouse</a>
        <span>Canada</span>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; <span id="year"></span> KV Media House. All Rights Reserved.</span>
      <span>Canada - Creative Digital Media & Marketing</span>
    </div>
  </div>
</footer>`;
}

function page(service) {
  const [parentKey, slug, title, statement, card, features, gallery, imageKey] = service;
  const parent = parents[parentKey];
  const prefix = '../../';
  const description = `${title} by KV Media House. ${statement}`;
  const filterButtons = parent.filters.map((label, index) => `<button class="sd-filter-btn${index === 0 ? ' active' : ''}" type="button" data-filter="${esc(label)}">${esc(label)}</button>`).join('');
  const workCards = gallery.map((item, index) => {
    const cls = index === 0 || index === 2 ? ' tall' : index === 4 ? ' wide' : '';
    const cat = parent.filters[(index % (parent.filters.length - 1)) + 1];
    return `<a href="${prefix}work.html" class="sd-work-card${cls}" data-cat="${esc(cat)}">
          <img src="${imageFor(service, index, index === 4)}" alt="${esc(item)}" loading="lazy" onerror="this.style.display='none'">
          <span>${esc(item)}</span><small>${esc(cat)}</small><i>&rarr;</i>
        </a>`;
  }).join('\n        ');
  const featureCards = features.map((feature, index) => `<article>
          <span>${String(index + 1).padStart(2, '0')}</span>
          <h3>${esc(feature)}</h3>
          <p>${esc(featureCopy(title, feature))}</p>
        </article>`).join('\n        ');
  const processCards = features.map((step, index) => `<article><span>${String(index + 1).padStart(2, '0')}</span><h3>${esc(step)}</h3><p>${esc(parent.process[index] ? parent.process[index][1] : featureCopy(title, step))}</p></article>`).join('\n        ');
  const tools = parent.tools.map(tool => `<span>${esc(tool)}</span>`).join('\n        ');
  const relatedMarkup = relatedCards(service, prefix);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(title)} - ${esc(parent.title)} - KV Media House</title>
<meta name="description" content="${esc(description)}" />
<meta property="og:title" content="${esc(title)} - ${esc(parent.title)} - KV Media House" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:type" content="website" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Manrope:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="icon" href="${prefix}assets/images/favicon.png" type="image/png">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">
<link rel="stylesheet" href="${prefix}assets/css/style.css">
</head>
<body class="service-detail-premium">
${header(prefix)}
<main id="main">
<div class="page-fade service-detail-page">
  <section class="sd-hero">
    <div class="sd-hero-bg media-frame">
      <img src="${imageFor(service, 0, true)}" alt="${esc(title)} visual" loading="eager" onerror="this.style.display='none'">
    </div>
    <div class="wrap sd-hero-inner">
      <div class="sd-hero-copy">
        <nav class="sd-breadcrumb reveal" aria-label="Breadcrumb">
          <a href="${prefix}services.html">Services</a><span>/</span><a href="../${parent.slug}.html">${esc(parent.title)}</a><span>/</span><span>${esc(title)}</span>
        </nav>
        <h1 class="reveal">${titleLines(title)}</h1>
        <div class="sd-title-rule reveal"></div>
        <p class="reveal">${esc(statement)}</p>
        <div class="sd-hero-actions reveal">
          <a href="${prefix}contact.html" class="btn btn-solid"><span>Let's Create</span></a>
          <a href="${prefix}work.html" class="sd-text-link">See Our Work <span>&rarr;</span></a>
        </div>
        <div class="sd-hero-ticks reveal" aria-hidden="true"><span>01</span><span>02</span><span>03</span></div>
      </div>
      <aside class="sd-hero-card reveal">
        <div class="sd-card-icons"><span>&#9678;</span><span>&#8600;</span></div>
        <p>${esc(card)}</p>
      </aside>
    </div>
  </section>

  <section class="sd-section sd-what">
    <div class="wrap sd-what-grid">
      <div class="sd-section-copy reveal">
        <span class="sd-kicker">What We Do</span>
        <h2>${esc(title)} that feels<br>clear, premium, and <em>purposeful.</em></h2>
        <div class="sd-mini-rule"></div>
        <p>${esc(statement)} KV Media House handles the creative direction, production details, and final delivery so your brand shows up with confidence.</p>
      </div>
      <div class="sd-feature-grid reveal-stagger">
        ${featureCards}
      </div>
    </div>
  </section>

  <section class="sd-section sd-work">
    <div class="wrap">
      <div class="sd-centered-heading reveal">
        <span class="sd-kicker">Explore The Possibilities</span>
        <h2>Choose what <em>your brand needs.</em></h2>
      </div>
      <div class="sd-filter-row reveal" aria-label="${esc(title)} filters">
        ${filterButtons}
      </div>
      <div class="sd-work-grid reveal">
        ${workCards}
      </div>
      <div class="sd-more reveal">
        <a href="${prefix}work.html" class="btn btn-ghost"><span>View More Work</span></a>
      </div>
    </div>
  </section>

  <section class="sd-section sd-process">
    <div class="wrap">
      <div class="sd-centered-heading reveal">
        <span class="sd-kicker">Behind The Process</span>
        <h2>Simple steps. <em>Powerful results.</em></h2>
      </div>
      <div class="sd-process-line reveal-stagger">
        ${processCards}
      </div>
    </div>
  </section>

  <section class="sd-section sd-tools">
    <div class="wrap sd-tools-grid">
      <div class="sd-section-copy reveal">
        <span class="sd-kicker">Tools We Use</span>
        <h2>Industry-leading tools.<br>For industry-leading <em>results.</em></h2>
      </div>
      <div class="sd-tool-row reveal-stagger" aria-label="Tools">
        ${tools}
      </div>
    </div>
  </section>

  <section class="sd-section">
    <div class="wrap">
      <div class="sd-centered-heading reveal">
        <span class="sd-kicker">Related Services</span>
        <h2>Explore connected <em>services.</em></h2>
      </div>
      <div class="related-grid reveal">
        ${relatedMarkup}
      </div>
    </div>
  </section>

  <section class="sd-final-cta">
    <div class="wrap sd-final-grid reveal">
      <div>
        <span class="sd-kicker">Ready To Create Something Amazing?</span>
        <h2>Let's create<br>something worth<br><em>watching.</em></h2>
      </div>
      <div>
        <p>${esc(card)} Your brand has a story to tell, and this service helps make it visible.</p>
        <div class="sd-final-actions">
          <a href="${prefix}contact.html" class="btn btn-solid"><span>Start a Project</span></a>
          <a href="${prefix}work.html" class="sd-text-link">See Our Work <span>&rarr;</span></a>
        </div>
      </div>
    </div>
  </section>
</div>
</main>
${footer(prefix)}
<script src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/bundled/lenis.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
<script src="${prefix}assets/js/script.js"></script>
</body>
</html>
`;
}

services.forEach(service => {
  const parent = parents[service[0]];
  const output = path.join(root, 'services', parent.slug, `${service[1]}.html`);
  fs.writeFileSync(output, page(service), 'utf8');
});

console.log(`Generated ${services.length} service detail pages.`);
