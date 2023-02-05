<?php

namespace Rsilva\UserOnboarding\Block;

use Magento\Framework\Api\FilterBuilder;
use Magento\Framework\Api\Search\FilterGroupBuilder;
use Magento\Framework\Api\Search\SearchCriteriaBuilder;
use Magento\Framework\Api\SortOrderBuilder;
use Magento\Framework\View\Element\Template;
use Rsilva\UserOnboarding\Api\Data\OnboardingInterface;
use Rsilva\UserOnboarding\Api\OnboardingRepositoryInterface;

class Onboarding extends Template
{

    public function __construct(
        Template\Context $context,
        protected OnboardingRepositoryInterface $onboardingRepository,
        protected SearchCriteriaBuilder $searchCriteriaBuilder,
        protected FilterGroupBuilder $filterGroupBuilder,
        protected FilterBuilder $filterBuilder,
        protected SortOrderBuilder $sortOrderBuilder,
        array $data = []
    ) {
        parent::__construct($context, $data);
    }

    public function get()
    {
        $onboarding = false;
        $layoutHandles = $this->getLayout()->getUpdate()->getHandles();

        $filterGroups = [
            /* $this->filterGroupBuilder->addFilter(
                $this->filterBuilder
                    ->setField('layout_handle')
                    ->setConditionType('in')
                    ->setValue($layoutHandles)
                    ->create()
            )->create(), */
            $this->filterGroupBuilder->addFilter(
                $this->filterBuilder
                    ->setField(OnboardingInterface::ENABLED)
                    ->setConditionType(OnboardingRepositoryInterface::EQ)
                    ->setValue(OnboardingRepositoryInterface::TRUE)
                    ->create()
            )->create()
        ];

        $sortOrder = $this->sortOrderBuilder
            ->setField(OnboardingInterface::ONBOARDING_ID)
            ->setDirection(OnboardingRepositoryInterface::SORT_DESC)
            ->create();

        $searchCriteria = $this->searchCriteriaBuilder->create()
            ->setFilterGroups($filterGroups)
            ->setSortOrders([$sortOrder])
            ->setPageSize(1);

        $onboardings = $this->onboardingRepository->getList($searchCriteria);

        if ($onboardings->getTotalCount()) {
            $onboarding = current($onboardings->getItems());
        }

        return $onboarding;
    }

}
