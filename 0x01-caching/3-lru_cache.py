#!/usr/bin/python3
"""Class LRUCache that inherits from BaseCaching"""
from base_caching import BaseCaching


class LRUCache(BaseCaching):
    """From BaseCahce to LRUCache"""

    def __init__(self):
        """Initializing"""
        super().__init__()
        self.order = []

    def put(self, key, item):
        """Assign self, key, item to dict"""
        if key and item:
            if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                removed = self.order.pop(0)
                self.cache_data.pop(removed)
                print("DISCARD: {}".format(removed))
            self.cache_data[key] = item
            self.order.append(key)

    def get(self, key):
        """Assign self, key to dict"""
        if key in self.cache_data:
            self.order.remove(key)
            self.order.append(key)
            return self.cache_data.get(key)
