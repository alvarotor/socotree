import CMS from 'netlify-cms-app'
import uploadcare from 'netlify-cms-media-library-uploadcare'
import cloudinary from 'netlify-cms-media-library-cloudinary'

import ImpressumPagePreview from './preview-templates/ImpressumPagePreview'
import AboutPagePreview from './preview-templates/AboutPagePreview'
import DatenschutzerklarungPagePreview from './preview-templates/DatenschutzerklarungPagePreview'
import IndexPagePreview from './preview-templates/IndexPagePreview'
import BerlinPagePreview from './preview-templates/BerlinPagePreview'
import BerlinDePagePreview from './preview-templates/BerlinDePagePreview'
import BerlinFAQPagePreview from './preview-templates/BerlinFAQPagePreview'
import BerlinDeFAQPagePreview from './preview-templates/BerlinDeFAQPagePreview'

CMS.registerMediaLibrary(uploadcare)
CMS.registerMediaLibrary(cloudinary)

CMS.registerPreviewTemplate('berlinFAQ', BerlinFAQPagePreview)
CMS.registerPreviewTemplate('berlindeFAQ', BerlinDeFAQPagePreview)
CMS.registerPreviewTemplate('berlinde', BerlinDePagePreview)
CMS.registerPreviewTemplate('berlin', BerlinPagePreview)
CMS.registerPreviewTemplate('index', IndexPagePreview)
CMS.registerPreviewTemplate('impressum', ImpressumPagePreview)
CMS.registerPreviewTemplate('about', AboutPagePreview)
CMS.registerPreviewTemplate('products', DatenschutzerklarungPagePreview)