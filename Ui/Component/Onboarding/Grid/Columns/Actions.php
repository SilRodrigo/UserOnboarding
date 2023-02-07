<?php

/**
 * @author Rodrigo Silva
 * @copyright Copyright (c) 2023 Rodrigo Silva (https://github.com/SilRodrigo)
 * @package Rsilva_UserOnboarding
 */

namespace Rsilva\UserOnboarding\Ui\Component\Onboarding\Grid\Columns;

use Rsilva\UserOnboarding\Controller\Adminhtml\Index\Index as IndexController;
use Rsilva\UserOnboarding\Controller\Adminhtml\Index\Edit as EditController;
use Rsilva\UserOnboarding\Controller\Adminhtml\Index\Delete as DeleteController;
use Rsilva\UserOnboarding\Model\Onboarding;
use Magento\Framework\View\Element\UiComponentFactory;
use Magento\Framework\View\Element\UiComponent\ContextInterface;
use Magento\Framework\UrlInterface;
use Magento\Ui\Component\Listing\Columns\Column;

class Actions extends Column
{
    /**
     * @var UrlInterface
     */
    protected $urlBuilder;

    /**
     * Constructor
     *
     * @param ContextInterface $context
     * @param UiComponentFactory $uiComponentFactory
     * @param UrlInterface $urlBuilder
     * @param array $components
     * @param array $data
     */
    public function __construct(
        ContextInterface $context,
        UiComponentFactory $uiComponentFactory,
        UrlInterface $urlBuilder,
        array $components = [],
        array $data = []
    ) {
        $this->urlBuilder = $urlBuilder;
        parent::__construct($context, $uiComponentFactory, $components, $data);
    }

    /**
     * Prepare Data Source
     *
     * @param array $dataSource
     * @return array
     */
    public function prepareDataSource(array $dataSource)
    {
        if (isset($dataSource['data']['items'])) {
            foreach ($dataSource['data']['items'] as &$item) {
                $storeId = $this->context->getFilterParam('store_id');
                $itemName = $this->getData('name');
                $item[$itemName]['edit'] = [
                    'href' => $this->urlBuilder->getUrl(
                        IndexController::FRONTNAME . EditController::URL_PATH,
                        [Onboarding::ID => $item[Onboarding::ID], 'store' => $storeId]
                    ),
                    'label' => __('Edit'),
                    'hidden' => false,
                ];
                $item[$itemName]['delete'] = [
                    'href' => $this->urlBuilder->getUrl(
                        IndexController::FRONTNAME . DeleteController::URL_PATH,
                        [Onboarding::ID => $item[Onboarding::ID], 'store' => $storeId]
                    ),
                    'label' => __('Delete'),
                    'hidden' => false,
                    'confirm' => [
                        'title' => __('Delete Onboarding?'),
                        'message' => __('Are you sure you want to delete this Onboarding?'),
                        '__disableTmpl' => true,
                    ],
                    'post' => true,
                    '__disableTmpl' => true,
                ];                
            }
        }
        return $dataSource;
    }
}
