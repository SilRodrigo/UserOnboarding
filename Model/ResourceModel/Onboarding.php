<?php

/**
 * @author Rodrigo Silva
 * @copyright Copyright (c) 2023 Rodrigo Silva (https://github.com/SilRodrigo)
 * @package Rsilva_UserOnboarding
 */

namespace Rsilva\UserOnboarding\Model\ResourceModel;

use Magento\Framework\Model\ResourceModel\Db\AbstractDb;

class Onboarding extends AbstractDb
{

    protected function _construct()
    {
        $this->_init('rsilva_user_onboarding', 'entity_id');
    }
}
