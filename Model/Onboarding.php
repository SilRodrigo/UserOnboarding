<?php

/**
 * @author Rodrigo Silva
 * @copyright Copyright (c) 2022 Rodrigo Silva (https://github.com/SilRodrigo)
 * @package Rsilva_Vitrine
 */

namespace Rsilva\UserOnboarding\Model;

use Magento\Framework\Model\AbstractModel;
use Rsilva\UserOnboarding\Model\ResourceModel\Onboarding as Resource;

/**
 * @SuppressWarnings(PHPMD.LongVariable)
 */
class Onboarding extends AbstractModel
{
    public const XML_PATH_CONFIG = 'rsilva_user_onboarding/index';
    public const MODULE = 'rsilva_user_onboarding';
    public const MAGENTO_REQUIRE_CONFIG_VALUE = 'req';
    public const DEFAULT_STORE_ID = 0;

    public const ID = 'entity_id';
    public const NAME = 'name';
    public const REQUIRED = 'required';
    public const ENABLED = 'enabled';
    public const SORT_ORDER = 'sort_order';

    /**
     * @SuppressWarnings(PHPMD.CamelCaseMethodName)
     */
    protected function _construct()
    {
        $this->_init(Resource::class);
    }

    /**
     * Set/Get attribute wrapper
     *
     * @param   string $method
     * @param   array $args
     * @return  mixed
     * @throws \Magento\Framework\Exception\LocalizedException
     */
    public function __call($method, $args)
    {
        switch (substr($method, 0, 3)) {
            case 'get':
                $key = $this->_underscore(substr($method, 3));
                $index = isset($args[0]) ? $args[0] : null;
                return $this->getData($key, $index);
            case 'set':
                $key = $this->_underscore(substr($method, 3));
                $value = isset($args[0]) ? $args[0] : null;
                return $this->setData($key, $value);
            case 'uns':
                $key = $this->_underscore(substr($method, 3));
                return $this->unsetData($key);
            case 'has':
                $key = $this->_underscore(substr($method, 3));
                return isset($this->_data[$key]);
        }
        throw new \Magento\Framework\Exception\LocalizedException(
            new \Magento\Framework\Phrase('Invalid method %1::%2', [get_class($this), $method])
        );
    }
}
