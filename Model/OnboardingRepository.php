<?php

/**
  * @author Rodrigo Silva
 * @copyright Copyright (c) 2023 Rodrigo Silva (https://github.com/SilRodrigo)
 * @package Rsilva_UserOnboarding
 */

namespace Rsilva\UserOnboarding\Model;

use Magento\Framework\Api\SearchCriteriaBuilder;
use Magento\Framework\Api\SortOrder;
use Psr\Log\LoggerInterface;
use Rsilva\UserOnboarding\Api\OnboardingRepositoryInterface;
use Rsilva\UserOnboarding\Api\Data\OnboardingInterface;
use Rsilva\UserOnboarding\Api\Data\OnboardingInterfaceFactory;
use Rsilva\UserOnboarding\Model\ResourceModel\Onboarding\CollectionFactory as OnboardingCollectionFactory;
use Magento\Framework\Api\SearchResultsInterfaceFactory;
use Magento\Framework\Api\SearchCriteria\CollectionProcessorInterface;
use Magento\Framework\Api\SearchCriteriaInterface;
use Magento\Framework\Exception\NoSuchEntityException;


class OnboardingRepository implements OnboardingRepositoryInterface
{
    public function __construct(
        private OnboardingInterfaceFactory $onboardingFactory,
        private OnboardingCollectionFactory $onboardingCollectionFactory,
        private SearchResultsInterfaceFactory $searchResultFactory,
        private CollectionProcessorInterface $collectionProcessor,
        private SearchCriteriaBuilder $searchCriteriaBuilder,
        private LoggerInterface $logger
    ) {
    }

    public function get($id)
    {
        $searchCriteria = $this->searchCriteriaBuilder->addFilter(OnboardingInterface::ONBOARDING_ID, $id)->create();
        $onboardings = $this->getList($searchCriteria);

        if ($onboardings->getTotalCount()) {
            $onboarding = current($onboardings->getItems());
        } else {
            throw new NoSuchEntityException(__('Unable to find onboarding with ID "%1"', $id));
        }

        return $onboarding;
    }

    public function save(OnboardingInterface $onboarding)
    {
        $onboarding->getResource()->save($onboarding);
        return $onboarding;
    }

    public function delete(OnboardingInterface $onboarding)
    {
        $onboarding->getResource()->delete($onboarding);
    }

    public function getList(SearchCriteriaInterface $searchCriteria)
    {
        $searchResults = $this->searchResultFactory->create();
        $searchResults->setSearchCriteria($searchCriteria);
        $collection = $this->onboardingCollectionFactory->create();
        foreach ($searchCriteria->getFilterGroups() as $filterGroup) {
            foreach ($filterGroup->getFilters() as $filter) {
                $condition = $filter->getConditionType() ?: 'eq';
                $collection->addFieldToFilter($filter->getField(), [$condition => $filter->getValue()]);
            }
        }
        $searchResults->setTotalCount($collection->getSize());
        $sortOrdersData = $searchCriteria->getSortOrders();
        if ($sortOrdersData) {
            foreach ($sortOrdersData as $sortOrder) {
                $collection->addOrder(
                    $sortOrder->getField(),
                    ($sortOrder->getDirection() == SortOrder::SORT_ASC) ? 'ASC' : 'DESC'
                );
            }
        }
        $collection->setCurPage($searchCriteria->getCurrentPage());
        $collection->setPageSize($searchCriteria->getPageSize());
        $searchResults->setItems($collection->getItems());
        return $searchResults;
    }
}
