import type { ImageMetadata } from 'astro';

// Hero (frames of the approved sleeping-elephant video; see VIDEO_ASSET_LOG.md)
import heroPosterDesktop from '../assets/images/hero/poster-desktop.png';
import heroPosterMobile from '../assets/images/hero/poster-mobile.png';
// Banners
import bannerZebras from '../assets/images/banners/about-zebras.webp';
import bannerFieldwork from '../assets/images/banners/fieldwork-expert-portrait.webp';
import bannerFooterValley from '../assets/images/banners/footer-valley.webp';
import bannerFooterTree from '../assets/images/banners/footer-tree-sunset.webp';
import bannerLandscape from '../assets/images/banners/sector-overview-landscape.webp';
// Sector cards
import sectorMining from '../assets/images/sectors/mining.webp';
import sectorEnergy from '../assets/images/sectors/energy.webp';
import sectorInfrastructure from '../assets/images/sectors/infrastructure.webp';
import sectorHousing from '../assets/images/sectors/housing.webp';
import sectorTourism from '../assets/images/sectors/tourism.webp';
// Service category cards
import serviceAssessment from '../assets/images/services/assessment-analysis.webp';
import serviceCommunity from '../assets/images/services/community-social-impact.webp';
import serviceTraining from '../assets/images/services/training-education.webp';
import serviceSpecialised from '../assets/images/services/specialized-technical.webp';
// Project thumbnails
import projectHeritage from '../assets/images/projects/cultural-heritage.webp';
import projectWater from '../assets/images/projects/infrastructure-water.webp';
import projectMining from '../assets/images/projects/mining-assessment.webp';
import projectSolar from '../assets/images/projects/renewable-solar.webp';
// Insight topics
import insightTree from '../assets/images/insights/african-tree.webp';
import insightLeaves from '../assets/images/insights/biodiversity-leaves.webp';
import insightHeritage from '../assets/images/insights/cultural-heritage.webp';
import insightWind from '../assets/images/insights/renewable-wind.webp';
import insightRiver from '../assets/images/insights/river-landscape.webp';
// Company profile 2024 photography (client-supplied; web reuse rights to be confirmed)
import profileHarareWide from '../assets/images/profile/harare-skyline-wide.jpg';
import profileHarareSquare from '../assets/images/profile/harare-skyline-square.jpg';
import profileMineTrucks from '../assets/images/profile/mine-haul-trucks.jpg';
import profileWindFarm from '../assets/images/profile/wind-farm.jpg';
import profileVictoriaFalls from '../assets/images/profile/victoria-falls.jpg';
import profileSolarFarm from '../assets/images/profile/solar-farm.jpg';
import profileOpenPit from '../assets/images/profile/open-pit-aerial.jpg';
import profileLeaves from '../assets/images/profile/leaves.jpg';
import profileHeritageHut from '../assets/images/profile/heritage-hut-acacia.jpg';
import profileEland from '../assets/images/profile/eland-grassland.jpg';
import profileDocuments from '../assets/images/profile/technical-documents.jpg';
import profileTreePlanting from '../assets/images/profile/tree-planting.jpg';
import profileZebras from '../assets/images/profile/zebras-panorama.jpg';
import profileCleanUp from '../assets/images/profile/community-clean-up.jpg';

export type MediaOrigin = 'hero-video' | 'company-profile-2024' | 'ai-illustrative';

export interface MediaItem {
  src: ImageMetadata;
  alt: string;
  origin: MediaOrigin;
  /** True when the image must not be read as documentary evidence of Black Crystal work. */
  illustrative: boolean;
  /** CSS object-position keyword pair used where the image is cropped. */
  focus?: string;
}

const profile = (src: ImageMetadata, alt: string, focus?: string): MediaItem => ({
  src,
  alt,
  origin: 'company-profile-2024',
  illustrative: true,
  ...(focus ? { focus } : {}),
});
const ai = (src: ImageMetadata, alt: string, focus?: string): MediaItem => ({
  src,
  alt,
  origin: 'ai-illustrative',
  illustrative: true,
  ...(focus ? { focus } : {}),
});

export const media = {
  'hero-poster-desktop': {
    src: heroPosterDesktop,
    alt: '',
    origin: 'hero-video',
    illustrative: true,
  },
  'hero-poster-mobile': { src: heroPosterMobile, alt: '', origin: 'hero-video', illustrative: true },

  'banner-zebras': profile(bannerZebras, 'Zebras grazing in golden savanna grassland', 'center'),
  'banner-fieldwork': ai(
    bannerFieldwork,
    'Illustrative image of an environmental field scientist holding a field tablet',
    'center top',
  ),
  'banner-footer-valley': ai(bannerFooterValley, 'River valley at dusk in southern Africa'),
  'banner-footer-tree': ai(bannerFooterTree, 'Silhouette of an acacia tree at sunset'),
  'banner-landscape': ai(
    bannerLandscape,
    'Hills and a river winding through a wooded southern African valley',
  ),

  'sector-mining': profile(sectorMining, 'Aerial view of terraced open-pit mine workings'),
  'sector-energy': profile(sectorEnergy, 'Wind turbines on grassy hills under a warm evening sky'),
  'sector-infrastructure': profile(sectorInfrastructure, 'Harare city skyline with high-rise buildings'),
  'sector-housing': ai(sectorHousing, 'Illustrative image of a residential housing development', 'center'),
  'sector-tourism': profile(sectorTourism, 'Water cascading over the Victoria Falls gorge'),

  'service-assessment': profile(serviceAssessment, 'Close-up of green leaves with water droplets'),
  'service-community': ai(
    serviceCommunity,
    'Illustrative image of community members taking part in an outdoor programme',
  ),
  'service-training': ai(
    serviceTraining,
    'Illustrative image of an environmental scientist working outdoors',
  ),
  'service-specialised': profile(serviceSpecialised, 'Aerial view of an earthen quarry landscape'),

  'project-heritage': ai(projectHeritage, 'Illustrative image of rock art on a sandstone surface'),
  'project-water': ai(projectWater, 'Illustrative image of a bridge crossing a river in hilly country'),
  'project-mining': profile(projectMining, 'Aerial view of open-pit mine workings'),
  'project-solar': profile(projectSolar, 'Rows of solar panels in a ground-mounted solar installation'),

  'insight-tree': ai(insightTree, 'Solitary acacia tree in dry savanna grassland'),
  'insight-leaves': ai(insightLeaves, 'Sunlight falling on glossy green leaves'),
  'insight-heritage': ai(insightHeritage, 'Illustrative image of ochre rock art figures'),
  'insight-wind': profile(insightWind, 'Wind turbines against a warm sky'),
  'insight-river': ai(insightRiver, 'River running between rocks through wooded country'),

  'profile-harare-wide': profile(profileHarareWide, 'Panoramic view of the Harare city skyline'),
  'profile-harare-square': profile(profileHarareSquare, 'Harare city skyline above a band of trees'),
  'profile-mine-trucks': profile(
    profileMineTrucks,
    'Haul trucks and an excavator working in an open-pit mine',
    'left center',
  ),
  'profile-wind-farm': profile(profileWindFarm, 'Wind farm spread across rolling hills at sunset'),
  'profile-victoria-falls': profile(profileVictoriaFalls, 'Victoria Falls with spray rising from the gorge'),
  'profile-solar-farm': profile(profileSolarFarm, 'Aerial view of rows of solar panels on green land'),
  'profile-open-pit': profile(profileOpenPit, 'Aerial view of terraced open-pit mine workings'),
  'profile-leaves': profile(profileLeaves, 'Dense green leaves with water droplets'),
  'profile-heritage-hut': profile(profileHeritageHut, 'Traditional thatched hut beneath acacia trees'),
  'profile-eland': profile(profileEland, 'Eland antelope moving through tall golden grass', 'center bottom'),
  'profile-documents': profile(profileDocuments, 'Stacks of bound reports and files on a desk'),
  'profile-tree-planting': profile(profileTreePlanting, 'Volunteers watering a newly planted tree seedling'),
  'profile-zebras': profile(profileZebras, 'Zebras grazing in open savanna grassland'),
  'profile-clean-up': profile(profileCleanUp, 'Participants gathered at a community environmental event'),
} satisfies Record<string, MediaItem>;

export type MediaKey = keyof typeof media;

export const mediaKeys = Object.keys(media) as MediaKey[];

export function getMedia(key: string): MediaItem {
  if (!(key in media)) throw new Error(`Unknown media key "${key}"`);
  return media[key as MediaKey];
}
