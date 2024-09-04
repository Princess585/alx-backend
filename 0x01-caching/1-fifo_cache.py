#!/usr/bin/env python3
"""FIFOCache that inherits from BaseChaching"""
from base_caching import BaseCaching


class FIFOCache(BaseCaching):
    """FIFOCaching from baseChaching"""

    def __init__(self):
        """Initializing the baseCache"""
        super().__init__()

    def put(self, key, item):
        """Must assign self, key, item from the dict"""
        if key and item:
            if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                removed = next(iter(self.cache_data))
                self.cache_data.pop(removed)
                print("DISCARD: {}".format(removed))
            self.cache_data[key] = item

    def get(self, key):
        """Return the value in self.cache_data"""
        return self.cache_data.get(key)
