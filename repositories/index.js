import CMS from '~/repositories/cms'
import GTM from '~/repositories/gtm'
import VIVA from '~/repositories/viva'

export default ($context) => ({
  ...CMS($context),
  ...GTM($context),
  ...VIVA($context)
})
