<?php

/**
 * @author Rodrigo Silva
 * @copyright Copyright (c) 2023 Rodrigo Silva (https://github.com/SilRodrigo)
 * @package Rsilva_UserOnboarding
 */

declare(strict_types=1);

namespace Rsilva\UserOnboarding\Model\ResourceModel\Onboarding;

use Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection;

class Collection extends AbstractCollection
{
    public function _construct()
    {
        $this->_init(
            \Rsilva\UserOnboarding\Model\Onboarding::class,
            \Rsilva\UserOnboarding\Model\ResourceModel\Onboarding::class
        );
    }
}