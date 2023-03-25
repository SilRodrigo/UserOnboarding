
# UserOnboarding Module for Magento 2

[![Latest Stable Version](https://img.shields.io/packagist/v/rsilva/user-onboarding.svg?style=flat-square)](https://packagist.org/packages/opengento/module-document)
[![License: MIT](https://img.shields.io/github/license/opengento/magento2-document.svg?style=flat-square)](./LICENSE) 
[![Packagist](https://img.shields.io/packagist/dt/rsilva/user-onboarding.svg?style=flat-square)](https://packagist.org/packages/rsilva/useronboarding/stats)
[![Packagist](https://img.shields.io/packagist/dm/rsilva/user-onboarding.svg?style=flat-square)](https://packagist.org/packages/rsilva/useronboarding/stats)

This module allows you to create onboarding for any frontend part of your website.

![Registration process](https://github.com/SilRodrigo/UserOnboarding/blob/master/view/adminhtml/web/images/backend.gif?raw=true)

![Frontend presentation](https://github.com/SilRodrigo/UserOnboarding/blob/master/view/adminhtml/web/images/frontend.gif?raw=true)

 - [Setup](#setup)
   - [Composer installation](#composer-installation)
   - [Setup the module](#setup-the-module)
 - [Features](#features) 
 - [Support](#support)
 - [Author](#author)
 - [License](#license)

## Setup

Magento 2 Open Source or Commerce edition is required.

### Composer installation

Run the following composer command:

```
composer require rsilva/user-onboarding
```

### Setup the module

Run the following magento command:

```
bin/magento module:enable Rsilva_Base Rsilva_UserOnboarding
bin/magento setup:upgrade
```

**If you are in production mode, do not forget to recompile and redeploy the static resources.**

## Features

This module allows you to create onboarding for any frontend part of your website.
It uses https://introjs.com/ lib.

## Support

Send a Hi to rodrigo.sil91@gmail.com and I will try to help.

## Author

- **Rodrigo Silva** - *Maintainer* - [![GitHub followers](https://img.shields.io/github/followers/SilRodrigo.svg?style=social)](https://github.com/SilRodrigo)


## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) details.

***That's all folks!***
