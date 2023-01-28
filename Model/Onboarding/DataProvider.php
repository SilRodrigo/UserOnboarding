<?php

/**
 * @author Rodrigo Silva
 * @copyright Copyright (c) 2022 Rodrigo Silva (https://github.com/SilRodrigo)
 * @package Rsilva_Vitrine
 */

declare(strict_types=1);

namespace Rsilva\UserOnboarding\Model\Onboarding;

use Rsilva\UserOnboarding\Model\Onboarding;
use Rsilva\UserOnboarding\Model\ResourceModel\Onboarding\CollectionFactory;
use Magento\Framework\App\RequestInterface;
use Magento\Ui\DataProvider\Modifier\PoolInterface;
use Magento\Ui\DataProvider\ModifierPoolDataProvider;
use Magento\Framework\Registry;

class DataProvider extends ModifierPoolDataProvider
{

    /**
     * @var RequestInterface
     */
    protected $request;

    /**
     * @var Registry
     */
    protected $registry;

    public function __construct(
        $name,
        $primaryFieldName,
        $requestFieldName,
        CollectionFactory $collectionFactory,
        Registry $registry,
        RequestInterface $request,
        array $meta = [],
        array $data = [],
        PoolInterface $pool = null
    ) {
        parent::__construct($name, $primaryFieldName, $requestFieldName, $meta, $data, $pool);
        $this->collection = $collectionFactory->create();
        $this->registry = $registry;
        $this->request = $request;
    }

    public function getData()
    {
        $data = parent::getData();
        $onboardingEntity = $this->registry->registry(Onboarding::MODULE);
        if ($onboardingEntity->getData()) {
            $data[$onboardingEntity->getEntityId()] = $onboardingEntity->getData();
        }
        return $data;
    }
}
