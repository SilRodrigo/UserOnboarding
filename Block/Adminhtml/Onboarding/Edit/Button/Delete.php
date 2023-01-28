<?php

/**
 * @author Rodrigo Silva
 * @copyright Copyright (c) 2022 Rodrigo Silva (https://github.com/SilRodrigo)
 * @package Rsilva_Vitrine
 */

namespace Rsilva\UserOnboarding\Block\Adminhtml\Onboarding\Edit\Button;

use Magento\Framework\View\Element\UiComponent\Control\ButtonProviderInterface;
use Rsilva\UserOnboarding\Model\Onboarding;
use Rsilva\UserOnboarding\Controller\Adminhtml\Index\Index;
use Rsilva\UserOnboarding\Controller\Adminhtml\Index\Delete as DeleteController;

/**
 * Class Delete
 */
class Delete extends Generic implements ButtonProviderInterface
{
    /**
     * Delete button
     *
     * @return array
     */
    public function getButtonData()
    {
        $onboardingEntity = $this->registry->registry(Onboarding::MODULE);
        $entityId = (int)$onboardingEntity->getEntityId();
        if ($entityId) {
            return [
                'id' => 'delete',
                'label' => __('Delete'),
                'on_click' => "deleteConfirm('" . __('Are you sure you want to delete this Onboarding?') . "', '"
                    . $this->getDeleteUrl() . "', {data: {}})",
                'class' => 'delete',
                'sort_order' => 10
            ];
        }

        return [];
    }

    /**
     * @param array $args
     * @return string
     */
    public function getDeleteUrl(array $args = [])
    {
        $params = array_merge($this->getDefaultUrlParams(), $args);
        return $this->getUrl(Index::FRONTNAME . DeleteController::URL_PATH, $params);
    }

    /**
     * @return array
     */
    protected function getDefaultUrlParams()
    {
        return ['_current' => true, '_query' => ['isAjax' => null]];
    }
}
